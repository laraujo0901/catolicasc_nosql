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
          label="School"
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
            :color="(current == l.name)?'blue':' grey'"
            @click="current = l.name">
            <v-list-tile-content>
              <span class="heading">{{ l.name }}</span>
              <span class="caption">{{ l.phone }}</span>
              <span class="caption">{{ l.birth_date }}</span>
              <span class="caption">{{ l.mother_name }}</span>
              <span class="caption">{{ l.father_name }}</span>
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
        address:'',
      },
      current: null,
      catechizings:[ {
        name:'',
        phone:'',
        address:'',
      }]
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
      var selected = this.catechizings.filter(i => i.name === this.current)[0]
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
          || this.new_catechizing.address == ''
          || this.catechizings.filter(i => i.name === this.new_catechizing.name).length > 0) {
        this.new_catechizing = { name: '', phone: '', address: ''};
        return
      }

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
    }
  }
}
</script>
