<template>
  <div class="home">
    <el-container>
      <el-header class="codergb-header">
        <TopBar />
      </el-header>
      <el-container>
        <el-aside width="200px" class="codergb-aside">
          <NavBar />
        </el-aside>
        <el-container>
          <el-main class="codergb-main">
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import TopBar from '../../components/topBar/TopBar.vue';
import NavBar from '@/components/navBar/NavBar.vue';

import localCache from '@/utils/cache';
import useLoginStore from '@/views/login/store';
const loginInit = useLoginStore();
loginInit.userMsg = localCache.getCache('userMsg');
</script>

<style scoped lang="less">
.codergb-header {
  border-bottom: 1px solid var(--line-color);
}
.codergb-aside {
  border-right: 1px solid var(--line-color);
  background-color: #0c2135;
}
.codergb-main {
  height: 89vh;
  overflow-y: scroll;
  background-color: #fff;
}
</style>
