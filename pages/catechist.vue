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
          label="Nome completo"
          v-model="current_catechist.name"/>
        <v-text-field
          label="Endereço"
          v-model="current_catechist.address"/>
        <v-text-field
          v-model="current_catechist.phone"
          label="telefone"
          @keyup.enter="addCatechist()"/>
        <v-list>
          <v-list-tile 
            v-for="(l, i) in catechists" 
            :key="i"
            color="black"
            @click="current = l.name">
            <v-list-tile-content @click="selectCatechist(l.id)">
              <span class="heading">{{ l.name }}</span>
              <span class="caption">{{ l.phone }}</span>
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
              v-model="new_schedule.week_day"
              :items="available_targets"
              label="Dia da semana" />
          </v-flex>
          <v-flex 
            xs2 
            pl-1>
            <v-text-field 
              v-model="new_schedule.begining_time"
              type="time"
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
            <v-list-tile-content >
              <span class="caption">{{ r.week_day_show }}</span>
              <span class="caption">{{ r.begining_time }}</span>
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
    return app.$axios.get('/catechists')
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
          catechists: records
        }
        return result
      })
  },
  data () {
    return {
      current_catechist:
      {
        name:'',
        phone:'',
        address:'',
      },
      new_schedule:{
        day:'',
        time:'',
      },
      current_schedule:{
        day:'',
        time:'',
      },
      catechists:[ {
        name:'',
        phone:'',
        address:'',
      }],
      available_targets: [ 'segunda-feira',
      'terça-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      'sábado'],
    }
  },
  computed: {
    current_schedules: function () {
      if (!this.current_catechist || !this.current_catechist.preferred_schedules) {
        return []
      }

      return this.current_catechist.preferred_schedules.map( i => {
        return {
          week_day: i.week_day,
          begining_time: i.begining_time,
          week_day_show: this.available_targets[i.week_day]
        }
      });
    }
  },
  created(){
    // this.catechists = this.updateData();
  },
  methods: {
    addSchedule () {
      if(!this.current_catechist.preferred_schedules) {
        this.current_catechist.preferred_schedules = []
      }
      // var targetId = this.catechists.filter(l => l.id === this.current_catechist.id)[0].id
      this.current_catechist.preferred_schedules.push({
        week_day: this.available_targets.indexOf(this.new_schedule.week_day),
        begining_time: this.new_schedule.begining_time
      })
      this.$axios.put('/catechists/' + this.current_catechist._id, this.current_catechist)
        .then(result => {
          var idx = this.catechists.indexOf(this.current_catechist) 
          this.catechists[idx] = result.data
          this.current_catechist = { name: '', phone: ''}
        })
        .catch(error => console.error('Erro criando catequista:', error))
    },
    addCatechist () {
      if (this.current_catechist == undefined
          || this.current_catechist.name == ''
          || this.current_catechist.phone == ''
          || this.current_catechist.address == '') {
        this.current_catechist = { name: '', phone: '', address: ''};
        return
      }

      if(!this.current_catechist.id) this.current_catechist.id = Math.random();

      this.$axios.post('/catechists', this.current_catechist)
        .then(result => {
          console.log('Catequista registrado:', result.data)
          this.catechists.push(result.data)
          this.current_catechist = { name: '', phone: '', address: ''};
        })
        .catch(error => console.error('Erro registrando catequista', error))
    },
    updateData(){
      return this.$axios.get('/catechists')
      .then(response => {
        this.catechists = response.data;
      });
    },
    selectCatechist(id){
      var selected = this.catechists.filter(i => i.id === id)[0]
      console.log('selected =>', selected);
      this.current_catechist = selected;
    }
  }
}
</script>
