<template>
  <div>
    <b-row>
      <b-col>
        <h2>Posts</h2>
      </b-col>
      <b-col
        ><b-button variant="primary" @click="RedirectToAddPost"
          >Add</b-button
        ></b-col
      >
    </b-row>
    <b-row>
      <b-col>
        <ul>
          <li v-for="item in posts" :key="item.id">
            <b-link @click="redirectToEditPost(item.id)">{{
              item.title
            }}</b-link>
          </li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "ListPosts",
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    axios.get("/Posts").then((response) => {
      this.posts = response.data;
    });
  },
  methods: {
    RedirectToAddPost() {
      router.push("/AddPost");
    },
    redirectToEditPost(id) {
      router.push("/EditPost/" + id);
    },
  },
};
</script>
