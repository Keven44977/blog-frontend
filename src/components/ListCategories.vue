<template>
  <div>
    <b-row>
      <b-col>
        <h2>Categories</h2>
      </b-col>
      <b-col
        ><b-button variant="primary" @click="RedirectToAddCategory"
          >Add</b-button
        ></b-col
      >
    </b-row>
    <b-row>
      <b-col>
        <ul>
          <li v-for="item in categories" :key="item.id">
            <b-link @click="redirectToEditCategory(item.id)">{{
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
  name: "ListCategories",
  data() {
    return {
      categories: [],
    };
  },
  mounted() {
    axios.get("/Categories").then((response) => {
      this.categories = response.data;
    });
  },
  methods: {
    RedirectToAddCategory() {
      router.push("/AddCategory");
    },
    redirectToEditCategory(id) {
      router.push("/EditCategory/" + id);
    },
  },
};
</script>
