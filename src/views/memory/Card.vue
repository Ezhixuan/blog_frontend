<template>
  <div class="p-4">
    <!-- Deck选择和分页控制 -->
    <div class="mb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="w-full md:w-64">
        <select 
          v-model="selectedDeckId" 
          class="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          @change="loadCards(1)"
        >
          <option value="">全部卡片</option>
          <option v-for="deck in decks" :key="deck.id" :value="deck.id">{{ deck.name }}</option>
        </select>
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

    <!-- 小测按钮 -->
    <div class="mb-4 flex justify-end">
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
        v-for="card in flashcards"
        :key="card.id"
        :id="card.id"
        :question="card.front"
        :answer="card.back"
        :is-expanded="expandedCardId === card.id"
        @expand="handleCardExpand"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Flashcard from './Flashcard.vue'; 
import { listAll } from '@/api/memoDeckController';
import { list, test, operate } from '@/api/memoCardCoreController';

// 分页参数
const pageSize = 9; // 每页9条数据
const currentPage = ref(1);
const totalPages = ref(0);
const total = ref(0);

// 数据相关
const decks = ref([]);
const flashcards = ref([]);
const selectedDeckId = ref('');
const loading = ref(false);
const expandedCardId = ref(null);

// 小测相关数据
const quizActive = ref(false);
const quizCards = ref([]);
const currentQuizIndex = ref(0);
const showAnswer = ref(false);
const startTime = ref(0);

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
    console.log(response);
    if (response.data.code === 0) {
      decks.value = response.data.data.data || [];
      console.log(decks.value);
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
      queryDTO: {
        current: page,
        size: pageSize,
      }
    };
    
    // 如果选择了特定的deck，添加deckId查询参数
    if (selectedDeckId.value) {
      params.queryDTO.deckId = selectedDeckId.value;
    }
    
    const response = await list(params);
    
    if (response.data.code === 0) {
      flashcards.value = response.data.data.data || [];
      total.value = response.data.data.total || 0;
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

// 开始小测
const startQuiz = async () => {
  try {
    loading.value = true;
    // 调用 test 接口获取测试卡片
    const params = {};
    
    // 如果选择了特定的deck，添加deckId查询参数
    if (selectedDeckId.value) {
      params.deckId = selectedDeckId.value;
    }
    
    const response = await test(params);
    
    if (response.data.code === 0 && response.data.data) {
      quizCards.value = response.data.data || [];
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
      operateDTO: {
        id: currentQuizCard.value.id,
        type: type,
        useTime: useTime
      }
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
        alert('小测已完成！');
      }, 300);
    }
  } catch (error) {
    console.error('提交评价失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadDecks();
  loadCards(1);
});
</script>

<style>
/* Add any global styles for the grid if needed */
</style>