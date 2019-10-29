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
            <ul class="list-group">
              <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
                <div class="row">
                  <div class="col-md">
                    {{ domain.name }}
                  </div>
                  <div class="col-md text-right">
                    <a class="btn btn-info" v-bind:href="domain.checkout" target="_brank">
                      <i class="fa fa-shopping-cart"></i>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios/dist/axios";
import AppItemList from "./AppItemList";

// https://checkout.hostgator.com.br/?a=add&sld=flightstation&tld=.com.br

export default {
  name: "DomainList",
  components: {
    AppItemList
  },
  data() {
    return {
      items: {
        prefix: [],
        suffix: [],
      }
    };
  },

  // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
  created() {
    this.getItems("prefix");
    this.getItems("suffix");
  },

  methods: {
    addItem(item) {
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
        this.items[item.type].push(newItem);
      });
    },
    deleteItem(item) {
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
      }).then(() => {
        this.getItems(item.type);
      });
    },
    getItems(type) {
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            query ($type: String) {
              prefixes: items (type: $type) {
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
        this.items[type] = query.data.prefixes;
      });
    },
  },

  // https://vuejs.org/v2/guide/computed.html
  computed: {
    domains() {
      const domains = [];
      for (const prefix of this.items.prefix) {
        for (const suffix of this.items.suffix) {
          const name = prefix.description + suffix.description;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`;
          domains.push({
            name,
            checkout
          });
        }
      }
      return domains;
    }
  }
};
</script>

<style>
</style>
