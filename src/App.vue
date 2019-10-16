<template>
  <div>
    <div id="slogan" class="text-center">
      <h1 class="brl">NameGator <i class="fa fa-check"></i></h1>
      <h6 class="text-secondary">Gerador de nomes utilizando Vue.js, GraphQl e Node</h6>
    </div>
    <div id="main">
      <DomainList></DomainList>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import DomainList from "./components/DomainList";

// https://checkout.hostgator.com.br/?a=add&sld=flightstation&tld=.com.br

export default {
  name: "app",
  components: {
    DomainList
  }
};
</script>

<style>
.brl {
  margin-bottom: 17px;
}

#slogan {
  margin: 30px 0;
}

#main {
  background-color: #f1f1f1;
  padding: 30px 0;
}
</style>
