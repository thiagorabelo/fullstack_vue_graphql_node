<template>
  <div>
    <h5>
      {{ title }} <i class="badge badge-info">{{ items.length }}</i>
    </h5>
    <div class="card">
      <div class="card-body">
        <ul class="list-group brl">
          <li class="list-group-item" v-for="item in items" v-bind:key="item.id">
            <div class="row">
              <div class="col-md">{{ item.description }}</div>
              <div class="col-md text-right">
                <button class="btn btn-info" v-on:click="deleteItem(item)">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="description"
            v-on:keyup.enter="addItem(type, description)"
            placeholder="Digite o item"
          />
          <div class="input-group-append">
            <button class="btn btn-info" v-on:click="addItem(type, description)">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppItemList",
  props: ["title", "type", "items"],
  data() {
    return {
      description: ""
    };
  },
  methods: {
    addItem(type, description) {
      this.$emit("addItem", {
        type,
        description
      });
      this.description = "";
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
