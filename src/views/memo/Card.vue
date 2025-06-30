<template>
  <div class="p-4">
    <!-- Deck选择和分页控制 -->
    <div class="mb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      <!-- 自定义下拉框 -->
      <div class="deck-dropdown w-full md:w-64 relative">
        <div 
          @click="toggleDeckDropdown"
          class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer flex justify-between items-center bg-white"
        >
          <span class="truncate">
            {{ selectedDeckName || '全部卡片' }}
          </span>
          <svg 
            :class="{ 'rotate-180': deckDropdownOpen }"
            class="h-5 w-5 text-gray-400 transition-transform duration-200" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- 下拉选项 -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div 
            v-if="deckDropdownOpen"
            class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            <!-- 全部卡片选项 -->
            <div 
              @click="selectDeck('', '全部卡片')"
              class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex justify-between items-center"
              :class="{ 'bg-blue-50 dark:bg-blue-900': selectedDeckId === '' }"
            >
              <span>全部卡片</span>
            </div>
            
            <!-- 卡片组选项 -->
            <div 
              v-for="deck in decks" 
              :key="deck.id"
              class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex justify-between items-center group"
              :class="{ 'bg-blue-50 dark:bg-blue-900': selectedDeckId === deck.id }"
            >
              <span @click="selectDeck(deck.id, deck.name)" class="flex-1 truncate">
                {{ deck.name }}
              </span>
              
              <!-- 管理员删除按钮 -->
              <button 
                v-if="canSubmitCard"
                @click.stop="handleDeckDelete(deck)"
                class="ml-2 p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="删除卡片组"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <!-- 没有卡片组时的提示 -->
            <div v-if="decks.length === 0" class="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
              暂无卡片组
            </div>
          </div>
        </transition>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="loadCards(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          上一页
        </button>
        <span class="dark:text-white">{{ currentPage }} / {{ totalPages || 1 }}</span>
        <button 
          @click="loadCards(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 工具按钮区 -->
    <div class="mb-4 flex justify-end space-x-3">
      <!-- 提交卡片按钮 - 仅当用户已登录且是管理员时显示 -->
      <button 
        v-if="canSubmitCard"
        @click="openSubmitForm"
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center"
        :disabled="loading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        提交卡片
      </button>
    
      <!-- 小测按钮 -->
      <button 
        @click="startQuiz"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        :disabled="loading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
        </svg>
        小测一下
      </button>
    </div>

    <!-- 卡片网格 -->
    <div class="flashcard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Flashcard
        v-for="(card, index) in flashcards"
        :key="card.id"
        :id="card.id"
        :question="card.front"
        :answer="card.back"
        :is-expanded="expandedCardId === card.id"
        :index="index"
        :total="flashcards.length"
        :prev-card="getPrevCard(index)"
        :next-card="getNextCard(index)"
        :can-delete="canSubmitCard"
        @expand="handleCardExpand"
        @navigate="handleCardNavigate"
        @delete="handleCardDelete"
      />
      <div v-if="loading" class="col-span-full flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
      <div v-if="!loading && flashcards.length === 0" class="col-span-full text-center py-10 dark:text-white">
        没有找到卡片
      </div>
    </div>

    <!-- 小测弹窗 -->
    <teleport to="body" v-if="quizActive">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-xl mx-auto shadow-2xl overflow-hidden">
          <!-- 没有测试数据时显示 -->
          <div v-if="quizCards.length === 0" class="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">休息一下吧！</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              看起来您已经掌握了所有知识点，可以放松一下或者随便看看其他内容。祝贺您的学习进步！
            </p>
            <button 
              @click="closeQuiz" 
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              关闭
            </button>
          </div>

          <!-- 有测试数据时显示 -->
          <div v-else>
            <!-- 标题栏 -->
            <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 class="font-bold text-gray-800 dark:text-white text-lg">
                记忆小测 {{ currentQuizIndex + 1 }}/{{ quizCards.length }}
              </h3>
              <button 
                @click="closeQuiz"
                class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- 问题内容 -->
            <div class="p-6 border-b dark:border-gray-700">
              <div class="mb-4">
                <h4 class="text-sm text-gray-500 dark:text-gray-400 mb-1">问题：</h4>
                <p class="text-lg text-gray-800 dark:text-white">{{ currentQuizCard.front }}</p>
              </div>
              <div v-if="showAnswer">
                <h4 class="text-sm text-gray-500 dark:text-gray-400 mb-1">答案：</h4>
                <p class="text-lg text-gray-800 dark:text-white">{{ currentQuizCard.back }}</p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="p-4">
              <div v-if="!showAnswer" class="flex justify-center">
                <button 
                  @click="revealAnswer" 
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  查看答案
                </button>
              </div>
              <div v-else class="grid grid-cols-3 gap-3">
                <button 
                  @click="rateCard(0)" 
                  class="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                  简单
                </button>
                <button 
                  @click="rateCard(1)" 
                  class="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  模糊
                </button>
                <button 
                  @click="rateCard(2)" 
                  class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  忘记
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 提交卡片弹窗 -->
    <teleport to="body" v-if="submitFormActive">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-xl mx-auto shadow-2xl overflow-hidden">
          <!-- 标题栏 -->
          <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 class="font-bold text-gray-800 dark:text-white text-lg">
              {{ isCreatingDeck ? '创建新卡片集' : '提交记忆卡片' }}
            </h3>
            <button 
              @click="closeSubmitForm"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 创建卡片集表单 -->
          <div v-if="isCreatingDeck" class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                卡片集名称
              </label>
              <input 
                v-model="newDeckName" 
                type="text" 
                class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="输入卡片集名称"
              />
            </div>

            <div class="flex justify-between mt-6">
              <button 
                @click="() => isCreatingDeck = false" 
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300"
              >
                返回
              </button>
              <button 
                @click="createDeck" 
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                :disabled="!newDeckName || submitting"
              >
                创建
              </button>
            </div>
          </div>

          <!-- 提交卡片表单 -->
          <div v-else class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                问题
              </label>
              <textarea 
                v-model="newCardFront" 
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="输入卡片正面的问题"
              ></textarea>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                答案
              </label>
              <textarea 
                v-model="newCardBack" 
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="输入卡片背面的答案"
              ></textarea>
            </div>

            <div class="mb-4">
              <div class="flex justify-between">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  选择卡片集
                </label>
                <button 
                  @click="() => isCreatingDeck = true" 
                  class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  创建新卡片集
                </button>
              </div>
              <div class="submit-deck-dropdown w-full relative">
                <div 
                  ref="submitDeckTrigger"
                  @click="toggleSubmitDeckDropdown"
                  class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer flex justify-between items-center bg-white"
                  :class="{ 'border-red-300': !newCardDeckId }"
                >
                  <span class="truncate" :class="{ 'text-gray-400': !newCardDeckId }">
                    {{ getSelectedDeckName() || '请选择卡片集' }}
                  </span>
                  <svg 
                    :class="{ 'rotate-180': submitDeckDropdownOpen }"
                    class="h-5 w-5 text-gray-400 transition-transform duration-200" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 提交表单下拉选项 - 使用teleport到body -->
            <teleport to="body" v-if="submitDeckDropdownOpen">
              <div 
                class="fixed z-50"
                :style="submitDropdownStyle"
                data-submit-dropdown
              >
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <div 
                    v-if="submitDeckDropdownOpen"
                    class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                    :style="{ width: submitDropdownWidth + 'px' }"
                  >
                    <!-- 卡片组选项 -->
                    <div 
                      v-for="deck in decks" 
                      :key="deck.id"
                      @click="selectSubmitDeck(deck.id, deck.name)"
                      class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex justify-between items-center"
                      :class="{ 'bg-blue-50 dark:bg-blue-900': newCardDeckId === deck.id }"
                    >
                      <span class="flex-1 truncate">{{ deck.name }}</span>
                    </div>
                    
                    <!-- 没有卡片组时的提示 -->
                    <div v-if="decks.length === 0" class="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                      暂无卡片组，请先创建一个
                    </div>
                  </div>
                </transition>
              </div>
            </teleport>

            <div class="flex justify-end mt-6">
              <button 
                @click="submitCard" 
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                :disabled="!newCardFront || !newCardBack || !newCardDeckId || submitting"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 删除卡片确认弹窗 -->
    <teleport to="body" v-if="deleteConfirmActive">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-auto shadow-2xl overflow-hidden">
          <!-- 标题栏 -->
          <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 class="font-bold text-gray-800 dark:text-white text-lg">
              确认删除
            </h3>
            <button 
              @click="closeDeleteConfirm"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 确认内容 -->
          <div class="p-6">
            <div class="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">删除记忆卡片</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  您确定要删除这张卡片吗？此操作无法撤销。
                </p>
              </div>
            </div>

            <!-- 卡片预览 -->
            <div v-if="cardToDelete" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div class="mb-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">问题：</span>
                <p class="text-sm text-gray-800 dark:text-white mt-1">{{ cardToDelete.front }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">答案：</span>
                <p class="text-sm text-gray-800 dark:text-white mt-1">{{ cardToDelete.back }}</p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeDeleteConfirm" 
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300"
                :disabled="deleting"
              >
                取消
              </button>
              <button 
                @click="confirmDeleteCard" 
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                :disabled="deleting"
              >
                <span v-if="deleting">删除中...</span>
                <span v-else>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 删除卡片组确认弹窗 -->
    <teleport to="body" v-if="deleteDeckConfirmActive">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-auto shadow-2xl overflow-hidden">
          <!-- 标题栏 -->
          <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 class="font-bold text-gray-800 dark:text-white text-lg">
              确认删除卡片组
            </h3>
            <button 
              @click="closeDeleteDeckConfirm"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 确认内容 -->
          <div class="p-6">
            <div class="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">删除卡片组</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  您确定要删除这个卡片组吗？此操作将同时删除该组内的所有卡片，且无法撤销。
                </p>
              </div>
            </div>

            <!-- 卡片组预览 -->
            <div v-if="deckToDelete" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div class="mb-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">卡片组名称：</span>
                <p class="text-sm text-gray-800 dark:text-white mt-1 font-medium">{{ deckToDelete.name }}</p>
              </div>
              <div v-if="deckToDelete.description">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">描述：</span>
                <p class="text-sm text-gray-800 dark:text-white mt-1">{{ deckToDelete.description }}</p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeDeleteDeckConfirm" 
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300"
                :disabled="deletingDeck"
              >
                取消
              </button>
              <button 
                @click="confirmDeleteDeck" 
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                :disabled="deletingDeck"
              >
                <span v-if="deletingDeck">删除中...</span>
                <span v-else>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import Flashcard from './Flashcard.vue'; 
import { listAll, add1 as addDeck, del1 as deleteDeck } from '@/api/memoDeckController';
import { list, test, operate } from '@/api/memoCardCoreController';
import { add as addCard, del as deleteCard, update as updateCard } from '@/api/memoController';
import { useUserStore } from '@/stores/user';
import messageService from '@/utils/helpers/message';

// 用户状态
const userStore = useUserStore();

// 分页参数
const pageSize = 9; // 每页9条数据
const currentPage = ref(1);
const totalPages = ref(0);
const total = ref(0);

// 数据相关
const decks = ref([]);
const flashcards = ref([]);
const selectedDeckId = ref('');
const selectedDeckName = ref('');
const loading = ref(false);
const expandedCardId = ref(null);

// 自定义下拉框相关
const deckDropdownOpen = ref(false);
const submitDeckDropdownOpen = ref(false);
const submitDeckTrigger = ref(null);
const submitDropdownStyle = ref({});
const submitDropdownWidth = ref(0);

// 小测相关数据
const quizActive = ref(false);
const quizCards = ref([]);
const currentQuizIndex = ref(0);
const showAnswer = ref(false);
const startTime = ref(0);

// 提交卡片相关数据
const submitFormActive = ref(false);
const isCreatingDeck = ref(false);
const newCardFront = ref('');
const newCardBack = ref('');
const newCardDeckId = ref('');
const newDeckName = ref('');
const submitting = ref(false);

// 删除卡片相关数据
const deleteConfirmActive = ref(false);
const cardToDelete = ref(null);
const deleting = ref(false);

// 删除卡片组相关数据
const deleteDeckConfirmActive = ref(false);
const deckToDelete = ref(null);
const deletingDeck = ref(false);

// 判断是否有权限提交卡片
const canSubmitCard = computed(() => {
  return userStore.isLoggedIn && userStore.userInfo?.role === 'admin';
});

// 当前小测卡片
const currentQuizCard = computed(() => {
  if (quizCards.value.length === 0 || currentQuizIndex.value >= quizCards.value.length) {
    return {};
  }
  return quizCards.value[currentQuizIndex.value];
});

// 加载deck列表
const loadDecks = async () => {
  try {
    const response = await listAll();
    if (response.code === 0) {
      decks.value = response.data.data || [];
    }
  } catch (error) {
    console.error('加载deck列表失败:', error);
  }
};

// 加载卡片数据
const loadCards = async (page) => {
  if (page < 1 || (totalPages.value > 0 && page > totalPages.value)) {
    return;
  }
  
  loading.value = true;
  currentPage.value = page;
  
  try {
    // 构建查询参数
    const params = {
      current: page,
      size: pageSize,
    };
    
    // 如果选择了特定的deck，添加deckId查询参数
    if (selectedDeckId.value) {
      params.deckId = selectedDeckId.value;
    }
    
    const response = await list(params);
    
    if (response.code === 0) {
      flashcards.value = response.data.data || [];
      total.value = response.data.total || 0;
      totalPages.value = Math.ceil(total.value / pageSize);
    } else {
      flashcards.value = [];
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('加载卡片数据失败:', error);
    flashcards.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取前一张卡片
const getPrevCard = (index) => {
  if (index <= 0 || flashcards.value.length <= 1) return null;
  return flashcards.value[index - 1];
};

// 获取后一张卡片
const getNextCard = (index) => {
  if (index >= flashcards.value.length - 1 || flashcards.value.length <= 1) return null;
  return flashcards.value[index + 1];
};

// 处理卡片展开
const handleCardExpand = (payload) => {
  if (payload.expand) {
    expandedCardId.value = payload.id;
  } else {
    if (expandedCardId.value === payload.id) {
      expandedCardId.value = null;
    }
  }
};

// 处理卡片导航
const handleCardNavigate = (payload) => {
  if (payload.cardId) {
    expandedCardId.value = payload.cardId;
  }
};

// 开始小测
const startQuiz = async () => {
  try {
    loading.value = true;
    const deckId = selectedDeckId.value || undefined;
    
    const response = await test(deckId);
    
    if (response.code === 0) {
      quizCards.value = response.data || [];
      currentQuizIndex.value = 0;
      showAnswer.value = false;
      quizActive.value = true;
      
      // 如果有测试卡片，记录开始时间
      if (quizCards.value.length > 0) {
        startTime.value = Date.now();
      }
    } else {
      quizCards.value = [];
      quizActive.value = true;
    }
  } catch (error) {
    console.error('获取测试卡片失败:', error);
    quizCards.value = [];
  } finally {
    loading.value = false;
  }
};

// 关闭小测
const closeQuiz = () => {
  quizActive.value = false;
  quizCards.value = [];
  currentQuizIndex.value = 0;
  showAnswer.value = false;
};

// 显示答案
const revealAnswer = () => {
  showAnswer.value = true;
};

// 评价卡片
const rateCard = async (type) => {
  // 计算答题耗时（毫秒）
  const useTime = Date.now() - startTime.value;
  
  try {
    // 调用 operate 接口
    const params = {
      id: currentQuizCard.value.id,
      type: type,
      useTime: useTime
    };
    
    await operate(params);
    
    // 进入下一题
    if (currentQuizIndex.value < quizCards.value.length - 1) {
      currentQuizIndex.value++;
      showAnswer.value = false;
      startTime.value = Date.now(); // 重置计时器
    } else {
      // 已完成所有题目
      quizActive.value = false;
      setTimeout(() => {
        messageService.success('小测已完成！');
      }, 300);
    }
  } catch (error) {
    console.error('提交评价失败:', error);
  }
};

// 打开提交卡片表单
const openSubmitForm = () => {
  // 重置表单数据
  newCardFront.value = '';
  newCardBack.value = '';
  newCardDeckId.value = selectedDeckId.value || '';
  isCreatingDeck.value = false;
  submitDeckDropdownOpen.value = false; // 重置下拉框状态
  submitFormActive.value = true;
};

// 关闭提交卡片表单
const closeSubmitForm = () => {
  submitFormActive.value = false;
  isCreatingDeck.value = false;
  submitDeckDropdownOpen.value = false; // 关闭下拉框
};

// 提交新卡片
const submitCard = async () => {
  if (!newCardFront.value || !newCardBack.value || !newCardDeckId.value) {
    messageService.error('请填写完整信息');
    return;
  }
  
  submitting.value = true;
  try {
    const params = {
      front: newCardFront.value,
      back: newCardBack.value,
      deckId: newCardDeckId.value
    };
    
    const response = await addCard(params);
    
    if (response.code === 0) {
      messageService.success('卡片提交成功！');
      closeSubmitForm();
      // 无论查看的是哪个卡片集，都刷新当前卡片列表
      loadCards(currentPage.value);
    } else {
      messageService.error(`提交失败: ${response.data.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('提交卡片失败:', error);
    messageService.error('提交失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 创建新卡片集
const createDeck = async () => {
  if (!newDeckName.value) {
    messageService.error('请输入卡片集名称');
    return;
  }
  
  submitting.value = true;
  try {
    const params = {
      name: newDeckName.value,
      description: ''
    };
    
    const response = await addDeck(params);
    
    if (response.code === 0) {
      messageService.success('卡片集创建成功！');
      // 重新加载deck列表
      await loadDecks();
      // 将新创建的deck设为选中状态
      const newDeckId = response.data.data;
      if (newDeckId) {
        newCardDeckId.value = newDeckId;
      }
      // 返回提交卡片表单
      isCreatingDeck.value = false;
    } else {
      messageService.error(`创建失败: ${response.data.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('创建卡片集失败:', error);
    messageService.error('创建失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 处理卡片删除请求
const handleCardDelete = (payload) => {
  // 找到要删除的卡片
  const cardToDeleteObj = flashcards.value.find(card => card.id === payload.id);
  if (cardToDeleteObj) {
    cardToDelete.value = cardToDeleteObj;
    deleteConfirmActive.value = true;
  }
};

// 关闭删除确认弹窗
const closeDeleteConfirm = () => {
  deleteConfirmActive.value = false;
  cardToDelete.value = null;
};

// 确认删除卡片
const confirmDeleteCard = async () => {
  if (!cardToDelete.value) {
    return;
  }
  
  deleting.value = true;
  try {
    const response = await deleteCard({ id: cardToDelete.value.id });
    
    if (response.code === 0) {
      messageService.success('卡片删除成功！');
      closeDeleteConfirm();
      // 刷新当前卡片列表
      loadCards(currentPage.value);
    } else {
      messageService.error(`删除失败: ${response.data.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('删除卡片失败:', error);
    messageService.error('删除失败，请稍后重试');
  } finally {
    deleting.value = false;
  }
};

// 切换下拉框显示状态
const toggleDeckDropdown = () => {
  deckDropdownOpen.value = !deckDropdownOpen.value;
};

// 选择卡片组
const selectDeck = (deckId, deckName) => {
  selectedDeckId.value = deckId;
  selectedDeckName.value = deckName;
  deckDropdownOpen.value = false;
  loadCards(1); // 重新加载第一页数据
};

// 切换提交表单下拉框显示状态
const toggleSubmitDeckDropdown = () => {
  if (!submitDeckDropdownOpen.value) {
    // 打开时计算位置
    if (submitDeckTrigger.value) {
      const rect = submitDeckTrigger.value.getBoundingClientRect();
      submitDropdownWidth.value = rect.width;
      
      // 计算下拉框应该显示的位置
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 240; // 估算的下拉框最大高度
      
      // 如果下方空间不够，则向上显示
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        submitDropdownStyle.value = {
          left: rect.left + 'px',
          bottom: (viewportHeight - rect.top) + 'px',
          top: 'auto'
        };
      } else {
        submitDropdownStyle.value = {
          left: rect.left + 'px',
          top: (rect.bottom + 4) + 'px',
          bottom: 'auto'
        };
      }
    }
  }
  
  submitDeckDropdownOpen.value = !submitDeckDropdownOpen.value;
};

// 选择提交表单的卡片组
const selectSubmitDeck = (deckId, deckName) => {
  newCardDeckId.value = deckId;
  submitDeckDropdownOpen.value = false;
};

// 获取选中的卡片组名称
const getSelectedDeckName = () => {
  if (!newCardDeckId.value) return '';
  const selectedDeck = decks.value.find(deck => deck.id === newCardDeckId.value);
  return selectedDeck ? selectedDeck.name : '';
};

// 处理卡片组删除请求
const handleDeckDelete = (deck) => {
  deckToDelete.value = deck;
  deleteDeckConfirmActive.value = true;
  deckDropdownOpen.value = false; // 关闭下拉框
};

// 关闭删除卡片组确认弹窗
const closeDeleteDeckConfirm = () => {
  deleteDeckConfirmActive.value = false;
  deckToDelete.value = null;
};

// 确认删除卡片组
const confirmDeleteDeck = async () => {
  if (!deckToDelete.value) {
    return;
  }
  
  deletingDeck.value = true;
  try {
    const response = await deleteDeck({ id: deckToDelete.value.id });
    
    if (response.data.code === 0) {
      messageService.success('卡片组删除成功！');
      
      // 如果删除的是当前选中的卡片组，则重置选择
      if (selectedDeckId.value === deckToDelete.value.id) {
        selectedDeckId.value = '';
        selectedDeckName.value = '';
      }
      
      // 重新加载数据
      await loadDecks();
      loadCards(1);
      
      // 所有操作完成后关闭弹窗
      closeDeleteDeckConfirm();
    } else {
      messageService.error(`删除失败: ${response.data.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('删除卡片组失败:', error);
    messageService.error('删除失败，请稍后重试');
  } finally {
    deletingDeck.value = false;
  }
};

// 点击外部关闭下拉框的处理
const handleClickOutside = (event) => {
  // 检查点击是否在主下拉框外部
  const dropdown = event.target.closest('.deck-dropdown');
  if (!dropdown && deckDropdownOpen.value) {
    deckDropdownOpen.value = false;
  }
  
  // 检查点击是否在提交表单下拉框外部
  const submitDropdown = event.target.closest('.submit-deck-dropdown');
  const submitDropdownList = event.target.closest('[data-submit-dropdown]');
  if (!submitDropdown && !submitDropdownList && submitDeckDropdownOpen.value) {
    submitDeckDropdownOpen.value = false;
  }
};

// 组件挂载时加载数据并添加事件监听器
onMounted(() => {
  loadDecks();
  loadCards(1);
  document.addEventListener('click', handleClickOutside);
  
  // 监听窗口大小变化，重新计算下拉框位置
  const handleResize = () => {
    if (submitDeckDropdownOpen.value) {
      // 如果下拉框是打开的，重新计算位置
      setTimeout(() => {
        toggleSubmitDeckDropdown();
        toggleSubmitDeckDropdown();
      }, 10);
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // 保存resize监听器的引用以便清理
  window._submitDropdownResizeHandler = handleResize;
});

// 组件卸载时清理监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (window._submitDropdownResizeHandler) {
    window.removeEventListener('resize', window._submitDropdownResizeHandler);
    delete window._submitDropdownResizeHandler;
  }
});
</script>

<style scoped>
/* 自定义下拉框样式 */
.deck-dropdown, .submit-deck-dropdown {
  /* 确保下拉框层级正确 */
}

.deck-dropdown .rotate-180, .submit-deck-dropdown .rotate-180 {
  transform: rotate(180deg);
}

/* 下拉选项的hover效果 */
.deck-dropdown .group:hover .opacity-0 {
  opacity: 1;
}

/* 选中状态的样式 */
.deck-dropdown .bg-blue-50, .submit-deck-dropdown .bg-blue-50 {
  background-color: rgba(59, 130, 246, 0.1);
}

.deck-dropdown .dark\\:bg-blue-900, .submit-deck-dropdown .dark\\:bg-blue-900 {
  background-color: rgba(30, 58, 138, 0.3);
}
</style>