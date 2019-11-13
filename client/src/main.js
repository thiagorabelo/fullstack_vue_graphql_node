import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import DomainList from "./components/DomainList.vue";
import DomainView from "./components/DomainView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/domains",
      component: DomainList
    },
    {
      path: "/",
      redirect: "/domains"
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
  render: h => h(App),
}).$mount("#app");
