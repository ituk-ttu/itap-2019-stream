<template lang="pug">
  .background
    .thanks(:class="$parent.activeMatch === 'THANKS' ? '' : 'out'")
      .header
        .logo
          p TAL
          p TECH
          p E-SPORT
        .text tänab:
      .nice Oli meeldiv!
      .scroll-container
        .scroll
          .people.group
            p(v-for="person in people") {{ person }}
    .end(:class="$parent.activeMatch === 'THANKS' ? '' : 'out'")

</template>

<script>
  const people = [
    'Rasmus Rüngenen',
    'Karl Juhan Küling',
    'Andri Luik',
    'Krista Vaabel',
    'Mikk Margus Möll',
    'Roland Eerik',
    'Sten Ärm',
    'Alex Bindevald',
    'Rait Kulbok',
    'Jan Joonas Parve',
    'Ragnar Kaseorg',
    'Priit Päll',
    'Martin Kalvik',
    'Tormi Peterson',
    'Alo Pullmann',
    'Rasmus Koit',
    'Oskar Mihhailov',
    'Märt Valdin',
    'Emily Joy Krohn',
    'Tõnis Lind',
    'Margo Raja',
    'Lauri Kukk',
    'Polina Rubtsova',
    'Jaagup Kümmel',
    'Johannes Kümmel',
    'Kaupo Kuusemäe',
    'Siim Pajusaar',
    'Martin Raid',
    'Henri Lumiste',
    'Martin Uiboupin',
    'Tõnis Piirits',
    'Sigrid Vollmer',
    'Raine Mäe',
    'Max Frolov',
    'Kristjan Hiis',
    'Imre Lebedev',
    'Peeter Sikk',
    'Ander Kivissaar',
    'Heiti Heli',
    'Alexander Alexandrov',
    'Mihkel Kaarma',
    'Tõnis Vaino',
    '•••',
    'TalTechi IT-teaduskonna üliõpilaskogu',
    'TalTechi infotehnoloogia teaduskond',
    'TalTechi üliõpilasesindus',
    'Arvutitark',
    'LG',
    'Belief',
    'Network Tomorrow',
    'MSI',
    'The Outdoor Broadcasting Van',
    'TalTechi filmiklubi',
    'Thorgate',
    'Gamdias',
    'Photopoint',
    'Nissan',
    'Roccat',
    'Speedlink',
    'X Game Room',
    'Telia',
    '•••',
    'ja kõik teised, kes meid aidanud on!'
  ];

  export default {
    name: 'Thanks',
    data () {
      return {
      };
    },
    methods: {
    },
    computed: {
      people: () => people
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/less/tt-colors.less";
  @import "../../assets/less/easing.less";


  @scroll: 5150;
  @scrollH: @scroll + 0px;
  @headerDelay: 0ms;
  @headerTime: 900ms;
  @scrollDelay: @headerDelay + @headerTime;
  @scrollTime: @scroll * 10ms;
  @thanksDelay: @scrollDelay + @scrollTime + 100ms;
  @thanksTime: 500ms;
  @logoDelay: @thanksDelay;
  @logoTime: 2000ms;
  @niceDelay: @logoDelay + @logoTime - 1000ms;
  @niceTime: 1000ms;

  .background {
    height: 100%;
    width: 100%;
    position: relative;
    background-image: url("../../assets/overlay/bracket-bg.png");
    background-size: cover;
  }
  .thanks, .end {
    position: absolute;
    padding: 80px;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: 'proxima_nova_altblack', sans-serif;
    color: @tt-white;
  }
  .thanks {
    transition: all @thanksTime @easeOutQuint;
    transition-delay: @thanksDelay;
    font-size: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .header {
      padding: 0 30px;
      width: 100%;
      display: flex;
      line-height: 38px;
      align-items: flex-end;
      justify-content: center;
      transition: all @headerTime @easeOutQuint;
      transition-delay: @headerDelay;
      transform: translateY(0);
      .logo {
        transform: translateY(250px) translateX(-37px) scale(3.0);
        transition: all @logoTime @easeOutQuint;
        transition-delay: @logoDelay;
      }
      .text {
        font-family: 'proxima_nova_altbold', sans-serif;
        transition: all @thanksTime @easeOutQuint @thanksDelay;
        opacity: 0;
        padding-left: 30px;
        overflow: hidden;
        text-align: right;
      }
    }
    .nice {
      height: 50px;
      text-align: center;
      font-family: 'proxima_nova_ltthin', sans-serif;
      transform: translateY(450px);
      font-size: 180px;
      transition: all @niceTime @easeOutQuint;
      transition-delay: @niceDelay;
    }
    .scroll-container {
      width: 100%;
      height: 700px;
      mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
      .scroll {
        font-family: 'proxima_nova_ltthin', sans-serif;
        text-align: center;
        transition: transform @scrollTime linear;
        transition-delay: @scrollDelay;
        transform: translateY(-@scrollH);
        .group {
          margin: 50px;
        }
      }
    }
  }
  .logo {
    font-size: 50px;
    p {
      margin: 0;
      line-height: 38px;
    }
  }
  .thanks.out {
    .header {
      transform: translateY(-250px);
      transition-duration: 0ms;
      transition-delay: 0ms;
      padding: 0;
      .logo {
        transform: translateY(0) scale(1);
        transition-duration: 0ms;
        transition-delay: 0ms;
      }
      .text {
        opacity: 1;
        width: 180px;
        transition-duration: 0ms;
        transition-delay: 0ms;
      }
    }
    .nice {
      opacity: 0;
      transform: translateY(500px) scale(0.5);
      transition-duration: 0ms;
      transition-delay: 0ms;
    }
    .scroll {
      transform: translateY(700px);
      transition-duration: 0ms;
      transition-delay: 0ms;
    }
  }


</style>
