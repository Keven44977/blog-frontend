<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>{{ this.modeString }} Post</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit">
          <b-form-group id="post-title" label="Title:" label-for="title">
            <b-form-input
              id="title"
              v-model="form.title"
              type="text"
              :state="titleState"
              aria-describedby="title-feedback"
              :placeholder="placeholders.title"
              autofocus
            >
            </b-form-input>
            <b-form-invalid-feedback id="title-feedback">
              {{ this.titleStateMessage }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="post-category"
            label="Category:"
            label-for="category"
          >
            <b-form-select
              id="category"
              v-model="form.category"
              :state="categoryState"
              aria-describedby="category-feedback"
              :options="categoriesNames"
            >
            </b-form-select>
            <b-form-invalid-feedback id="category-feedback">
              Please select a category
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="post-publication-date"
            label="Pub Date:"
            label-for="pub-date"
          >
            <b-form-input
              id="pub-date"
              v-model="form.publicationDate"
              type="text"
              :state="pubDateState"
              aria-describedby="title-feedback"
              :placeholder="placeholders.publicationDate"
            ></b-form-input>
            <b-form-invalid-feedback id="pub-date-feedback">
              The date needs to be in yyyy-mm-dd format
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group id="post-content" label="Content:" label-for="content">
            <b-form-textarea
              id="content"
              v-model="form.content"
              :state="contentState"
              aria-describedby="content-feedback"
              :placeholder="placeholders.content"
            ></b-form-textarea>
            <b-form-invalid-feedback id="content-feedback">
              The content cannot be empty.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button class="my-2" type="submit">Save</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "AddPost",
  data() {
    return {
      form: {
        title: null,
        category: null,
        publicationDate: null,
        content: null,
      },
      titleState: null,
      titleStateMessage: "The title cannot be empty",
      pubDateState: null,
      categoryState: null,
      contentState: null,
      categories: [],
      categoriesNames: [],
      modeString: "Add",
      isEditMode: false,
      placeholders: {
        title: null,
        category: null,
        publicationDate: "yyyy-mm-dd",
        content: null,
      },
      postToEdit: null,
    };
  },
  mounted() {
    axios.get("/Categories").then((response) => {
      this.categories = response.data;

      this.categories.forEach((category) => {
        this.categoriesNames.push({ value: category.id, text: category.title });
      });

      if (this.isNumeric(this.$route.params.id)) {
        this.modeString = "Edit";
        this.isEditMode = true;
        this.getPost(this.$route.params.id);
      }
    });
  },
  methods: {
    isNumeric(string) {
      if (typeof string != "string") {
        return false;
      }
      return !isNaN(string) && !isNaN(parseFloat(string));
    },
    isDateValid(dateString) {
      if (dateString == null) {
        return false;
      }
      const regex = /^\d{4}-\d{2}-\d{2}$/;

      if (dateString.match(regex) === null) {
        return false;
      }

      var date = new Date(dateString);
      var timestamp = date.getTime();

      if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
        return false;
      }

      return date.toISOString().startsWith(dateString);
    },
    getPost(id) {
      axios.get("/Posts/" + id).then((response) => {
        this.postToEdit = response.data;

        var category = this.categories.find(
          (category) => category.id === this.postToEdit.categoryId
        );

        this.placeholders.title = this.postToEdit.title;
        this.placeholders.category = category;
        this.placeholders.publicationDate =
          this.postToEdit.publicationDate.substring(
            0,
            this.postToEdit.publicationDate.indexOf("T")
          );
        this.placeholders.content = this.postToEdit.content;

        this.categoriesNames.unshift({
          value: null,
          text: this.placeholders.category.title,
          disabled: true,
        });
      });
    },
    handleAxiosError(error) {
      if (error.response.status == 400) {
        if (this.form.title == null || this.form.title.trim().length === 0) {
          this.titleState = false;
          this.titleStateMessage = "The title cannot be empty";
        } else {
          this.titleState = null;
        }
      } else if (error.response.status == 409) {
        this.titleState = false;
        this.titleStateMessage = "This title already exists";
      }
    },

    isFormValid() {
      if (this.form.category == null) {
        if (this.placeholders.category == null) {
          this.categoryState = false;
        } else {
          this.form.category = this.placeholders.category.id;
        }
      } else {
        this.categoryState = true;
      }

      if (this.form.title == null || this.form.title.trim().length === 0) {
        if (this.placeholders.title == null) {
          this.titleState = false;
        } else {
          this.form.title = this.placeholders.title;
        }
      } else {
        this.titleState = null;
      }

      if (this.form.content == null || this.form.content.trim().length === 0) {
        if (this.placeholders.content == null) {
          this.contentState = false;
        } else {
          this.form.content = this.placeholders.content;
        }
      } else {
        this.contentState = true;
      }

      if (!this.isDateValid(this.form.publicationDate)) {
        if (
          this.form.publicationDate == null &&
          this.placeholders.publicationDate != "yyyy-mm-dd"
        ) {
          this.form.publicationDate = this.placeholders.publicationDate;
        } else {
          this.pubDateState = false;
        }
      } else {
        this.pubDateState = true;
      }

      return this.categoryState && this.contentState && this.pubDateState;
    },
    onSubmit() {
      event.preventDefault();

      if (this.isFormValid()) {
        if (this.isEditMode) {
          axios
            .put("/Posts", {
              id: this.postToEdit.id,
              title: this.form.title,
              categoryId: this.form.category,
              publicationDate: this.form.publicationDate,
              content: this.form.content,
            })
            .then((response) => {
              if (response.status == 200) {
                router.push("/");
              }
            })
            .catch((error) => {
              this.handleAxiosError(error);
            });
        } else {
          var params = {
            title: this.form.title,
            categoryId: this.form.category,
            PublicationDate: this.form.publicationDate,
            content: this.form.content,
          };

          axios
            .post("/Posts", params)
            .then((response) => {
              if (response.status == 200) {
                router.push("/");
              }
            })
            .catch((error) => {
              this.handleAxiosError(error);
            });
        }
      }
    },
  },
};
</script>
