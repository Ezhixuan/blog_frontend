<template>
  <div v-if="currentTheme === 'dark'" class="starfield-background">
    <div class="stars-layer stars-small"></div>
    <div class="stars-layer stars-medium"></div>
    <div class="stars-layer stars-large"></div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../../utils/helpers/theme'
const { currentTheme } = useTheme()


</script>

<style scoped>
/* 星空背景 */
.starfield-background {
  @apply fixed inset-0 w-full h-full pointer-events-none;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  z-index: -1;
  overflow: hidden;
}

.stars-layer {
  @apply absolute inset-0 w-full h-full;
}

/* 小星星 */
.stars-small {
  background-image: 
    radial-gradient(1px 1px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 40px 70px, white, transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(1px 1px at 130px 80px, white, transparent),
    radial-gradient(1px 1px at 160px 30px, white, transparent),
    radial-gradient(1px 1px at 190px 100px, white, transparent),
    radial-gradient(1px 1px at 230px 50px, white, transparent),
    radial-gradient(1px 1px at 270px 90px, white, transparent),
    radial-gradient(1px 1px at 300px 20px, white, transparent),
    radial-gradient(1px 1px at 340px 110px, white, transparent),
    radial-gradient(1px 1px at 380px 60px, white, transparent),
    radial-gradient(1px 1px at 420px 40px, white, transparent),
    radial-gradient(1px 1px at 460px 120px, white, transparent),
    radial-gradient(1px 1px at 500px 70px, white, transparent),
    radial-gradient(1px 1px at 540px 10px, white, transparent),
    radial-gradient(1px 1px at 580px 100px, white, transparent),
    radial-gradient(1px 1px at 620px 50px, white, transparent),
    radial-gradient(1px 1px at 660px 130px, white, transparent),
    radial-gradient(1px 1px at 700px 30px, white, transparent),
    radial-gradient(1px 1px at 740px 80px, white, transparent);
  background-repeat: repeat;
  background-size: 800px 400px;
  animation: twinkle-small 8s ease-in-out infinite;
  opacity: 0.6;
}

/* 中等星星 */
.stars-medium {
  background-image: 
    radial-gradient(2px 2px at 60px 50px, #87ceeb, transparent),
    radial-gradient(2px 2px at 180px 140px, #87ceeb, transparent),
    radial-gradient(2px 2px at 300px 80px, #87ceeb, transparent),
    radial-gradient(2px 2px at 450px 20px, #87ceeb, transparent),
    radial-gradient(2px 2px at 600px 120px, #87ceeb, transparent),
    radial-gradient(2px 2px at 750px 60px, #87ceeb, transparent),
    radial-gradient(2px 2px at 120px 100px, #87ceeb, transparent),
    radial-gradient(2px 2px at 360px 160px, #87ceeb, transparent),
    radial-gradient(2px 2px at 520px 40px, #87ceeb, transparent),
    radial-gradient(2px 2px at 680px 180px, #87ceeb, transparent);
  background-repeat: repeat;
  background-size: 900px 500px;
  animation: twinkle-medium 12s ease-in-out infinite;
  opacity: 0.8;
}

/* 大星星 */
.stars-large {
  background-image: 
    radial-gradient(3px 3px at 100px 100px, #ffd700, transparent),
    radial-gradient(3px 3px at 400px 50px, #ffd700, transparent),
    radial-gradient(3px 3px at 700px 150px, #ffd700, transparent),
    radial-gradient(3px 3px at 250px 200px, #ffd700, transparent),
    radial-gradient(3px 3px at 550px 120px, #ffd700, transparent),
    radial-gradient(3px 3px at 800px 80px, #ffd700, transparent);
  background-repeat: repeat;
  background-size: 1000px 600px;
  animation: twinkle-large 15s ease-in-out infinite;
  opacity: 0.9;
}

/* 闪烁动画 */
@keyframes twinkle-small {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  25% { opacity: 0.8; transform: scale(1.1); }
  50% { opacity: 0.4; transform: scale(0.9); }
  75% { opacity: 0.9; transform: scale(1.05); }
}

@keyframes twinkle-medium {
  0%, 100% { opacity: 0.8; transform: scale(1) rotate(0deg); }
  33% { opacity: 1; transform: scale(1.2) rotate(5deg); }
  66% { opacity: 0.6; transform: scale(0.8) rotate(-5deg); }
}

@keyframes twinkle-large {
  0%, 100% { opacity: 0.9; transform: scale(1) rotate(0deg); }
  20% { opacity: 1; transform: scale(1.3) rotate(3deg); }
  40% { opacity: 0.7; transform: scale(0.9) rotate(-3deg); }
  60% { opacity: 1.1; transform: scale(1.1) rotate(2deg); }
  80% { opacity: 0.8; transform: scale(1.05) rotate(-2deg); }
}
</style> 