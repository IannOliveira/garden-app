<template>
  <div class="logo">
    <RouterLink to="/">
      <div class="logo">
        <svg width="200" height="26" viewBox="0 0 174 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20.1369 26C22.8983 26 25.1842 23.7425 24.6732 21.0288C24.3528 19.3274 23.8679 17.6594 23.2235 16.0502C21.9602 12.8958 20.1087 10.0295 17.7745 7.61522C15.4403 5.2009 12.6692 3.28575 9.61949 1.97913C8.11383 1.33406 6.55481 0.843538 4.96489 0.512196C2.26154 -0.0511821 0 2.23858 0 5V21C0 23.7614 2.23858 26 5 26H20.1369Z"
            fill="#2ecc71"
          />
          <g style="mix-blend-mode: multiply">
            <path
              d="M13.7013 26C10.9399 26 8.65395 23.7425 9.16502 21.0288C9.48544 19.3274 9.97031 17.6594 10.6147 16.0502C11.878 12.8958 13.7295 10.0295 16.0637 7.61522C18.3979 5.2009 21.169 3.28575 24.2187 1.97913C25.7244 1.33406 27.2834 0.843538 28.8733 0.512196C31.5767 -0.0511821 33.8382 2.23858 33.8382 5V21C33.8382 23.7614 31.5996 26 28.8382 26H13.7013Z"
              fill="#3498db"
            />
          </g>

          <text x="40" y="20" font-size="20" fill="red">G</text>
          <text x="65" y="20" font-size="20" fill="orange">A</text>
          <text x="90" y="20" font-size="20" fill="green">R</text>
          <text x="115" y="20" font-size="20" fill="blue">D</text>
          <text x="140" y="20" font-size="20" fill="purple">E</text>
          <text x="165" y="20" font-size="20" fill="brown">N</text>
        </svg>
      </div>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
