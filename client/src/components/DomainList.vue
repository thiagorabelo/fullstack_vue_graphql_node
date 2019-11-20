<template>
  <div>
    <div>
      <div class="container">
        <div class="row brl">
          <div class="col-md">
            <AppItemList
              title="Prefixox"
              type="prefix"
              v-bind:items="items.prefix"
              v-on:addItem="addItem"
              v-on:deleteItem="deleteItem"></AppItemList>
          </div>

          <div class="col-md">
            <AppItemList
              title="Sufixos"
              type="suffix"
              v-bind:items="items.suffix"
              v-on:addItem="addItem"
              v-on:deleteItem="deleteItem"></AppItemList>
          </div>
        </div>

        <h5>Domínios <i class="badge badge-info">{{ domains.length }}</i></h5>
        <div class="card">
          <div class="card-body">
            <ul class="list-group" v-if="isLoadedDomains">
              <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
                <div class="row">
                  <div class="col-md-6">
                    {{ domain.name }}
                  </div>
                  <div class="col-md-3">
                    <span class="badge"
                          v-bind:class="{ 'badge-info': domain.avaliable,
                                          'badge-warning': !domain.avaliable }">
                      {{ domain.avaliable ? "Disponível" : "Não Disponível" }}
                    </span>
                  </div>
                  <div class="col-md-3 text-right">
                    <a class="btn btn-info" v-bind:href="domain.checkout" target="_brank">
                      <i class="fa fa-shopping-cart"></i>
                    </a>
                    &nbsp;
                    <button class="btn btn-info" v-on:click="openDomain(domain)">
                      <i class="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <div class="text-center" v-else>
              <img src="/loading.gif" alt="Loading domains">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppItemList from "./AppItemList";

// https://checkout.hostgator.com.br/?a=add&sld=flightstation&tld=.com.br

export default {
  name: "DomainList",
  components: {
    AppItemList
  },
  data() {
    return {};
  },

  computed: {
    ...mapState(["items", "domains", "isLoadedDomains"])
  },

  methods: {
    ...mapActions(["addItem", "deleteItem", "getItems", "generateDomains"]),

    openDomain(domain) {
      this.$router.push({
        path: `/domain/${domain.name}`
      });
    }
  },
};
</script>

<style>
</style>
