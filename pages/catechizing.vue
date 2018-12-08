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
          v-model="new_catechizing.name"/>
        <v-text-field
          v-model="new_catechizing.phone"
          label="telefone"
          />
        <v-text-field
          label="Data de nascimento"
          type="date"
          v-model="new_catechizing.birth_date"/>
        <v-text-field
          label="Data de batismo"
          type="date"
          v-model="new_catechizing.baptism_date"/>
        <v-text-field
          label="Data da eucaristia"
          type="date"   
          v-model="new_catechizing.eucharist_date"/>
        <v-text-field
          label="Endereço"
          v-model="new_catechizing.address"/>
        <v-text-field
          label="Escola"
          v-model="new_catechizing.school"/>
        <v-text-field
          label="Turma na escola"
          v-model="new_catechizing.school_class"/>
          <v-text-field
          label="Nome completo da mãe"
          v-model="new_catechizing.mother_name"/> 
          <v-text-field
          label="Nome completo do pai"
          v-model="new_catechizing.father_name"
          @keyup.enter="addCatechizing()"/>         
        <v-list>
          <v-list-tile 
            v-for="(l, i) in catechizings" 
            :key="i"
            color="black"
            @click="current = l.name">
            <v-list-tile-content>
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
      new_catechizing:
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
    current_catechizing: function () {
      if (!this.current) {
        return null
      }
      var selected = this.catechizings.filter(i => i.id === this.current)[0]
      return selected
    }
  },
  created(){
    // this.catechists = this.updateData();
  },
  methods: {
    addCatechizing() {
      if (this.new_catechizing == undefined
          || this.new_catechizing.name == ''
          || this.new_catechizing.phone == ''
          || this.new_catechizing.address == '') {
        this.new_catechizing = { name: '', phone: '', address: ''};
        return
      }

      if(!this.new_catechizing.id) this.new_catechizing.id = Math.random();

      this.$axios.post('/catechizings', this.new_catechizing)
        .then(result => {
          console.log('Catequizando registrado:', result.data)
          this.catechizings.push(result.data)
          this.new_catechizing = { name: '', phone: '', address: ''};
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
      return this.$axios.get('/catechizings', this.current_catechizing.name)
      .then(response => {
        this.classmates = response.data;
      });
    }
  }
}
</script>
