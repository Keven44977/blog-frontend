import Vue from "vue";
import VueRouter from "vue-router";
import BlogView from "../views/BlogView.vue";
import AddOrEditPost from "../views/AddOrEditPost.vue";
import AddOrEditCategory from "../views/AddOrEditCategory.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: BlogView,
  },
  {
    path: "/AddPost",
    name: "addPost",
    component: AddOrEditPost,
  },
  {
    path: "/AddCategory",
    name: "addCategory",
    component: AddOrEditCategory,
  },
  {
    path: "/EditCategory/:id",
    name: "editCategory",
    component: AddOrEditCategory,
  },
  {
    path: "/EditPost/:id",
    name: "editPost",
    component: AddOrEditPost,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
