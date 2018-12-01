# katecheo

> Gestão de turmas de catequese

## Regras do sistema

- Temos catequistas, catequisandos e turmas.
- Há vários catequisandos em uma turma.
- Um catequisando só pode estar em uma turma.
- Um catequista pode ter várias turmas, em horários distintos. Não podemos ter um catequista com duas turmas num mesmo horário.
- Uma turma se reúne em um local (comunidade e sala) e horário.
- Cada catequisando tem um ou mais horários de preferência. Com isso, o sistema pode sugerir uma turma para incluir o catequisando, quando ele for cadastrado.
- Cada catequista também tem um horário de preferência. As turmas geralmente são abertas com base na disponibilidade dos catequistas.
- As turmas aceitam catequisandos até um limite de 15. Atingindo o limite, o sistema prioriza a sugestão de turmas com menos catequisandos, para uma melhor distribuição dos catequisandos.

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
