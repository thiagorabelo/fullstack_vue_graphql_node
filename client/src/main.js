import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import axios from "axios/dist/axios";
import App from "./App.vue";
import DomainList from "./components/DomainList.vue";
import DomainView from "./components/DomainView.vue";

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    items: {
      prefix: [],
      suffix: [],
    },
    domains: [],
    isLoadedDomains: false
  },

  mutations: {
    addItem(state, payload) {
      const { item, newItem } = payload;
      state.items[item.type].push(newItem);
    },
    deleteItem(state, payload) {
      const { item } = payload;
      const index = state.items[item.type].findIndex(it => it.id === item.id);

      if (index >= 0) {
        state.items[item.type].splice(index, 1);
      }
    },
    setItems(state, payload) {
      const { items, type } = payload;
      state.items[type] = items;
    },
    setDomains(state, payload) {
      const { domains } = payload;
      state.domains = domains;
    },
    setIsLoadedDomains(state, payload) {
      const isLoaded = payload;
      state.isLoadedDomains = isLoaded;
    }
  },

  actions: {
    async addItem(context, payload) {
      const item = payload;
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($item: ItemInput) {
              newItem: saveItem(item: $item) {
                id
                type
                description
              }
            }
          `,
          variables: {
            item
          }
        }
      }).then(response => {
        const query = response.data;
        const newItem = query.data.newItem;
        context.commit("addItem", { item, newItem });
        context.dispatch("generateDomains");
      });
    },
    async deleteItem(context, payload) {
      const item = payload;
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($id: Int) {
              deleted: deleteItem(id: $id)
            }
          `,
          variables: {
            id: item.id
          }
        }
      }).then(response => {
        const query = response.data;

        if (query.data.deleted) {
          context.commit("deleteItem", { item });
          context.dispatch("generateDomains");
        }
      });
    },
    async getItems(context, payload) {
      const type = payload;
      return axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            query ($type: String) {
              items: items (type: $type) {
                id
                type
                description
              }
            }
          `,
          variables: {
            type
          }
        }
      }).then(response => {
        const query = response.data;
        context.commit("setItems", { type, items: query.data.items });
      });
    },
    async generateDomains(context) {
      context.commit("setIsLoadedDomains", false);
      return axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation {
              domains: generateDomains {
                name
                checkout
                avaliable
              }
            }
          `
        }
      }).then((response) => {
        const query = response.data;
        context.commit("setDomains", { domains: query.data.domains });
        context.commit("setIsLoadedDomains", true);
      });
    }
  }
});

Promise.all([
  store.dispatch("getItems", "prefix"),
  store.dispatch("getItems", "suffix")
]).then(() => {
  store.dispatch("generateDomains");
});

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/domains"
    },
    {
      path: "/domains",
      component: DomainList
    },
    {
      path: "/domain/:domain",
      component: DomainView,
      props: true
    }
  ]
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
