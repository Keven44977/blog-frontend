<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>{{ this.modeString }} Category</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit">
          <b-form-group id="category-title" label="Title:" label-for="title">
            <b-form-input
              id="title"
              v-model="form.title"
              type="text"
              :state="titleState"
              aria-describedby="title-feedback"
              :placeholder="titlePlaceHolder"
              autofocus
            >
            </b-form-input>
            <b-form-invalid-feedback id="title-feedback">
              {{ this.titleStateMessage }}
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
  name: "AddCategory",
  data() {
    return {
      form: {
        title: "",
      },
      categoryToEdit: null,
      titleState: null,
      titleStateMessage: "The title cannot be empty",
      titlePlaceHolder: "",
      modeString: "Add",
      isEditMode: false,
    };
  },
  mounted() {
    if (this.isNumeric(this.$route.params.id)) {
      this.modeString = "Edit";
      this.isEditMode = true;
      this.getCategory(this.$route.params.id);
    }
  },
  methods: {
    isNumeric(string) {
      if (typeof string != "string") {
        return false;
      }
      return !isNaN(string) && !isNaN(parseFloat(string));
    },
    getCategory(id) {
      axios.get("/Categories/" + id).then((response) => {
        this.categoryToEdit = response.data;
        this.titlePlaceHolder = this.categoryToEdit.title;
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
    onSubmit() {
      event.preventDefault();

      if (this.form.title == null) {
        if (this.titlePlaceHolder == null) {
          this.titleState = false;
        } else {
          this.form.title = this.titlePlaceHolder;
        }
      }

      if (this.isEditMode) {
        this.categoryToEdit.title = this.form.title;
        axios
          .put("/Categories", {
            id: this.categoryToEdit.id,
            title: this.categoryToEdit.title,
          })
          .then((response) => {
            if (response.status == 200) {
              this.titleState = true;
              router.push("/");
            }
          })
          .catch((error) => {
            this.handleAxiosError(error);
          });
      } else {
        axios
          .post("/Categories", null, {
            params: { title: this.form.title },
          })
          .then((response) => {
            if (response.status == 200) {
              this.titleState = true;
              router.push("/");
            }
          })
          .catch((error) => {
            if (error.response.status == 400) {
              if (
                this.form.title == null ||
                this.form.title.trim().length === 0
              ) {
                this.titleState = false;
                this.titleStateMessage = "The title cannot be empty";
              } else {
                this.titleState = null;
              }
            } else if (error.response.status == 409) {
              this.titleState = false;
              this.titleStateMessage = "This title already exists";
            }
          });
      }
    },
  },
};
</script>
