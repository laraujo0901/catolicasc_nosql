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
          v-model="new_catechist"
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
              v-model="new_schedule_day"
              :items="available_targets.map(i => i.week_day)"
              label="Dia da semana" />
          </v-flex>
          <v-flex 
            xs2 
            pl-1>
            <v-text-field 
              v-model="new_schedule_time"
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
      new_location: '',
      new_target: '',
      new_distance: 0,
      current: null,
    }
  },
  computed: {
    available_targets: function () {
      if(!this.current_location || !this.current_location.routes) {
        return this.locations
      }

      var available = this.locations
        .filter(l => {
          return this.current_routes
            .filter(r => r.location._id == l._id).length == 0
        })
        .filter(l => l._id !== this.current_location._id)
      return available
    },
    current_location: function () {
      if (!this.current) {
        return null
      }
      var selected = this.locations.filter(i => i._id === this.current)[0]
      return selected
    },
    current_routes: function () {
      if (!this.current_location || !this.current_location.routes) {
        return []
      }

      var r = this.current_location.routes || []
      return r.map(r => {
          return {
            location: this.locations.filter(l => l._id === r.target)[0],
            distance: this.current_location.routes[r]
          }
        })
    }
  },
  methods: {
    addRoute () {
      if(!this.current_location.routes) {
        this.current_location.routes = []
      }
      var targetId = this.locations.filter(l => l.name === this.new_target)[0]._id
      this.current_location.routes.push({
        target: targetId,
        distance: parseInt(this.new_distance)
      })
      this.$axios.put('/locations/' + this.current_location._id, this.current_location)
        .then(result => {
          var idx = this.locations.indexOf(this.current_location) 
          this.locations[idx] = result.data
          this.new_target = ''
          this.new_distance = 0;
        })
        .catch(error => console.error('Erro criando localização:', error))
    },
    addLocation () {
      if (this.new_location == '' || 
          this.locations.filter(i => i.name === this.new_location).length > 0) {
        this.new_location = ''
        return
      }

      this.$axios.post('/locations', {name: this.new_location})
        .then(result => {
          console.log('Localização criada:', result.data)
          this.locations.push(result.data)
          this.new_location = ''
        })
        .catch(error => console.error('Erro criando localização:', error))
    }
  }
}
</script>
