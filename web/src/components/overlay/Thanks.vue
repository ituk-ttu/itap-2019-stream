<template lang="pug">
  .background
    .thanks(:class="$parent.isVisible ? '' : 'out'")
      .header
        img(src="../../assets/ituk.horisontal.long.color.nottu.svg").logo
        .text tänab:
      .scroll-container
        .scroll
          .people.group
            p(v-for="person in people") {{ person }}
    .end(:class="$parent.isVisible ? '' : 'out'")
    .color-bar
      img(src="../../assets/ituk.symbol.colored.svg")

</template>

<script>
  const people = [
    'Helena Väinmaa',
    'Raimond Lume',
    'Lauri Kukk',
    'Priit Päll',
    'Aneta C. Mattila',
    'Andres Eelma',
    'Annabel Tsarjov',
    'Maarja Hoop',
    'Katrin Selin',
    'Ilja Samoilov',
    'Robert Vassel',
    'Maria Rizo',
    'Kristjan Variksoo',
    'Kaur Palang',
    'Rait Kulbok',
    'Polina Rubtsova',
    'Kaupo Kuusemäe',
    'Nils-Emil Lille',
    '...',
    'Gert Jervan',
    'Ago Luberg',
    'Ago Uibo',
    'Egert Ebruk',
    'Lauri Greenbaum',
    'Kertu Pikk',
    'Liisi Räim',
    'Marek Õunpuu',
    'Martin Valler',
    'Kristjan Hiis',
    '...',
    'Finestmedia',
    'Nortal',
    'SEB',
    'Ericsson',
    'Avalanche Labs',
    'Omniva',
    'Vali IT!',
    'Icefire',
    'Pipedrive',
    '...',
    'Mektory',
    'TalTech Kolledž',
    'TalTech IT-teaduskond',
    'Event Media'
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


  @scroll: 3600;
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


  .color-bar img {
    width: 60px;
    height: 60px;
    z-index: 2147483647;
    float: right;
    padding: 0;
    margin-top: 10px;
    margin-right: 10px;
  }

  .color-bar  {
    background-color: @tt-ityk-red;
    width: 80px;
    height: 100vh;
    z-index: 2147483647;
    float: right;
  }
  .background {
    height: 100%;
    width: 100%;
    position: relative;
    background-color: @tt-white;
    background-size: cover;
  }
  .thanks, .end {
    position: absolute;
    padding: 80px;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: 'Raleway SemiBold', sans-serif;
    color: @tt-black ;
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
        transform: translateY(350px) translateX(88px) scale(3.0);
        transition: all @logoTime @easeOutQuint;
        transition-delay: @logoDelay;
      }
      .text {
        font-family: 'Raleway SemiBold', sans-serif;
        transition: all @thanksTime @easeOutQuint @thanksDelay;
        opacity: 0;
        padding-left: 30px;
        overflow: hidden;
        text-align: right;
        margin-top: auto;
        margin-bottom: auto;
      }
    }
    .nice {
      height: 50px;
      text-align: center;
      font-family: 'raleway', sans-serif;
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
        font-family: 'raleway', sans-serif;
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
