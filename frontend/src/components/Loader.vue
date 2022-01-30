<template>
  <div class="loadcontent">
    <div class="loading"></div>
    <div class="loading__letter loading__letter--1">G</div>
    <div class="loading__letter loading__letter--2">R</div>
    <div class="loading__letter loading__letter--3">O</div>
    <div class="loading__letter loading__letter--4">U</div>
    <div class="loading__letter loading__letter--5">P</div>
    <div class="loading__letter loading__letter--6">O</div>
    <div class="loading__letter loading__letter--7">M</div>
    <div class="loading__letter loading__letter--8">A</div>
    <div class="loading__letter loading__letter--9">N</div>
    <div class="loading__letter loading__letter--10">I</div>
    <div class="loading__letter loading__letter--11">A</div>
  </div>
</template>

<script>
export default {
  name: 'Loader',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

$num-letter: 12;
$anim-dur: 1000ms;
$anim-delay: $anim-dur / $num-letter;

@import url('https://fonts.googleapis.com/css2?family=Bilbo+Swash+Caps&display=swap');
.loadcontent {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.90);
  animation: loadinger 0.8s;
  animation-delay: 2.9s;
  animation-fill-mode: both;
  left: 0%;
  top: 0%;
}

.loading {
  z-index: 1;
  opacity: 1;

  &__letter {
    font-family: 'Bilbo Swash Caps', cursive;
    font-size: 3rem;
    color: black;
    animation: loading 0.5s ease-in-out 3 both;
    animation-direction: alternate-reverse;

    @for $i from 1 through $num-letter {
      &--#{$i} {
        animation-delay: $anim-delay*$i;
        background: -webkit-gradient(linear, left top, left bottom, from(#9356DC), to(#FF79DA));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &--2 {
      padding-right: 5px;
    }

    &--4 {
      //padding-right: 5px;
    }
    &--5 {
      padding-right: 5px;
    }
  }
}

@keyframes loading {
  0% {
    transform: translateY(0);

  }
  100% {
    transform: translateY(-30px);
  }
}


@keyframes loadinger {

  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    z-index: -3;
    transform: translateY(-9999999);
  }
}
</style>
