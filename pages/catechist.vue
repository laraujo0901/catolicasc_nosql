<template>
  <v-layout 
    row 
    wrap>
    <v-layout>
      <v-flex 
        text-xs-left
        xs4
        ma-1>
        <span class="title">Catequistas</span>
        <v-text-field
          v-model="new_catechist.name"/>
        <v-text-field
          v-model="new_catechist.phone"
          label="Adicionar"
          @keyup.enter="addCatechist()"/>
        <v-list>
          <v-list-tile 
            v-for="(l, i) in catechists" 
            :key="i"
            :color="(current == l._id)?'white':' grey'"
            @click="current = l._id">
            <v-list-tile-content>
              <span class="heading">{{ l.name }}</span>
              <span class="caption">{{ l.phone }}</span>
              <span class="caption">{{ (l.groups || []).length }} turma(s)</span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex 
        v-if="current_schedule != null" 
        xs8
        ma-1>
        <v-flex xs12>
          <span class="title">Horários de disponibilizadade</span>
        </v-flex>
        <v-layout
          row 
          wrap>
          <v-flex
            xs8
            pr-1>
            <v-select
              v-model="new_schedule.day"
              :items="available_targets"
              label="Dia da semana" />
          </v-flex>
          <v-flex 
            xs2 
            pl-1>
            <v-text-field 
              v-model="new_schedule.time"
              type="datetime"
              label="Horário" />          
          </v-flex>
          <v-flex 
            xs2
            pl-1>
            <v-btn @click="addSchedule()"><v-icon>add</v-icon></v-btn>
          </v-flex>
        </v-layout>
        <v-list 
          two-line>
          <v-list-tile 
            v-for="(r, i) in current_schedules" 
            :key="i">
            <v-list-tile-content>
              <span class="heading">{{ r.catechist.name }}</span>
              <span class="caption">{{ r.day }}</span>
              <span class="caption">{{ r.time }}</span>
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
    return app.$axios.get('/locations')
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.error(error)
        return []
      })
      .then(records => {
        var result = {
          locations: records
        }
        return result
      })
  },
  data () {
    return {
      new_catechist:
      {
        name:'',
        phone:'',
      },
      new_schedule:{
        day:'',
        time:'',
      },
      current: null,
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
    current_catechist: function () {
      if (!this.current) {
        return null
      }
      var selected = this.catechists.filter(i => i._id === this.current)[0]
      return selected
    },
    current_schedules: function () {
      if (!this.current_catechist || !this.current_catechist.schedules) {
        return []
      }

      var r = this.current_catechist.schedules || []
      return r.map(r => {
          return {
            catechist: this.catechists.filter(l => l._id === r.target)[0],
            schedule: this.current_catechist.schedules[r]
          }
        })
    }
  },
  methods: {
    addSchedule () {
      if(!this.current_catechist.schedules) {
        this.current_catechist.schedules = []
      }
      var targetId = this.catechists.filter(l => l.name === this.new_catechist.name)[0]._id
      this.current_catechist.schedules.push({
        target: targetId,
        day: parseInt(this.new_schedule.day),
        time: parseInt(this.new_schedule.time)
      })
      this.$axios.put('/catechists/' + this.current_catechist._id, this.current_catechist)
        .then(result => {
          var idx = this.catechists.indexOf(this.current_catechist) 
          this.catechists[idx] = result.data
          this.new_catechist = { name: '', phone: ''}
        })
        .catch(error => console.error('Erro criando catequista:', error))
    },
    addCatechist () {
      if (this.new_catechist == undefined
          || this.new_catechist.name == ''
          || this.new_catechist.phone == ''
          || this.catechists.filter(i => i.name === this.new_catechist.name).length > 0) {
        this.new_catechist = { name: '', phone: '', };
        return
      }

      this.$axios.post('/catechists', this.new_catechist)
        .then(result => {
          console.log('Catequista registrado:', result.data)
          this.catechists.push(result.data)
          this.new_catechist = { name: '', phone: '', };
        })
        .catch(error => console.error('Erro registrando catequista', error))
    }
  }
}
</script>
