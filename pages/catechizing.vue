<template>
  <v-layout 
    row 
    wrap>
    <v-layout>
      <v-flex 
        text-xs-left
        xs4
        ma-1>
        <span class="title">Catequizando</span>
        <v-text-field
          label="Nome completo"
          v-model="current_catechizing.name"/>
        <v-text-field
          v-model="current_catechizing.phone"
          label="telefone"
          />
        <v-text-field
          label="Data de nascimento"
          type="date"
          v-model="current_catechizing.birth_date"/>
        <v-text-field
          label="Data de batismo"
          type="date"
          v-model="current_catechizing.baptism_date"/>
        <v-text-field
          label="Data da eucaristia"
          type="date"   
          v-model="current_catechizing.eucharist_date"/>
        <v-text-field
          label="Endereço"
          v-model="current_catechizing.address"/>
        <v-text-field
          label="Escola"
          v-model="current_catechizing.school"/>
        <v-text-field
          label="Turma na escola"
          v-model="current_catechizing.school_class"/>
          <v-text-field
          label="Nome completo da mãe"
          v-model="current_catechizing.mother_name"/> 
          <v-text-field
          label="Nome completo do pai"
          v-model="current_catechizing.father_name"
          @keyup.enter="addCatechizing()"/>         
        <v-list>
          <v-list-tile 
            v-for="(l, i) in catechizings" 
            :key="i"
            color="black"
            @click="current = l.name">
            <v-list-tile-content @click="selectCatechizing(l.id)">
              <span class="heading">{{ l.name }}</span>
              <span class="caption">{{ l.phone }}</span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list>
          <v-list-tile 
            v-for="(l, i) in classmates" 
            :key="i"
            color="black"
            @click="current = l.name">
            <v-list-tile-content>
              <span class="heading">{{ l.name }}</span>
              <span class="caption">{{ l.phone }}</span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list> 
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
export default {
  asyncData(app) {
    return app.$axios.get('/catechizings')
      .then(response => {
        console.log("response.data",response.data);
        return response.data
      })
      .catch(error => {
        console.error(error)
        return []
      })
      .then(records => {
        var result = {
          catechizings: records
        }
        return result
      })
  },
  data () {
    return {
      current_catechizing:
      {
        name:'',
        phone:'',
        birth_date:'',
        baptism_date:'',
        eucharist_date:'',
        address:'',
        school:'',
        school_class:'',
        mother_name:'',
        father_name:'',
      },
      current: null,
      catechizings:[ {
        name:'',
        phone:'',
        birth_date:'',
        baptism_date:'',
        eucharist_date:'',
        address:'',
        school:'',
        school_class:'',
        mother_name:'',
        father_name:'',
      },],
      classmates:[],
      current_catechizing:{}
    }
  },
  computed: {
    available_targets: function () {
      return [ 'segunda-feira',
      'terça-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      'sábado'];
    },
  },
  created(){
    // this.catechists = this.updateData();
  },
  methods: {
    addCatechizing() {
      if (this.current_catechizing == undefined
          || this.current_catechizing.name == ''
          || this.current_catechizing.phone == ''
          || this.current_catechizing.address == '') {
        this.current_catechizing = { name: '', phone: '', address: ''};
        return
      }

      if(!this.current_catechizing.id) this.current_catechizing.id = Math.random();

      this.$axios.post('/catechizings', this.current_catechizing)
        .then(result => {
          console.log('Catequizando registrado:', result.data)
          this.catechizings.push(result.data)
          this.current_catechizing = { name: '', phone: '', address: ''};
        })
        .catch(error => console.error('Erro registrando catequista', error))
    },
    updateData(){
      return this.$axios.get('/catechizings')
      .then(response => {
        this.catechizings = response.data;
      });
    },
    getClassMates(){
      return this.$axios.get('/catechizings', this.current_catechizing.id)
      .then(response => {
        console.log("classmates => ", response.data)
        this.classmates = response.data;
      });
    },
    selectCatechizing(id){
      var selected = this.catechizings.filter(i => i.id === id)[0]
      console.log('selected =>', selected);
      this.current_catechizing = selected;
      this.getClassMates();
    }
  }
}
</script>
