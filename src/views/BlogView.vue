<template>
  <b-container>
    <h1>BLOG</h1>
    <ListCategories />
    <ListPosts />
  </b-container>
</template>

<script>
import ListCategories from "@/components/ListCategories.vue";
import ListPosts from "@/components/ListPosts.vue";

export default {
  name: "BlogView",
  components: { ListCategories, ListPosts },
};
</script>
