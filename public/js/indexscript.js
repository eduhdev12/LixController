$(document).ready(() => {
  function updateUptime() {
    $.get('./uptime/', (res) => {
      document.getElementById("uptime").innerHTML = `<a class="panel-block" id="uptime">
    <span class="panel-icon">
      <i class="fas fa-clock" aria-hidden="true"></i>
    </span>
    ${res.uptime}`;
    })
    $.get('./getbattery/', (res) => {
      document.getElementById("battery").innerHTML = `<a class="panel-block" id="battery">
        <span class="panel-icon">
          <i class="fas fa-battery-three-quarters" aria-hidden="true"></i>
        </span>
        ${res[0].battery}% (${res[1].charging})`
    })
    $.get('./getcpu', (res) => {
      document.getElementById("cpu").innerHTML = `<a class="panel-block" id="cpu">
        <span class="panel-icon">
          <i class="fas fa-microchip" aria-hidden="true"></i>
        </span>
        ${res[0].currentload} (${res[1].cpumodel})`
    })
    $.get('./getram', (res) => {
      document.getElementById("ram").innerHTML = `<a class="panel-block" id="ram">
        <span class="panel-icon">
          <i class="fas fa-memory" aria-hidden="true"></i>
        </span>
        ${res[0].used} MB / ${res[1].total} MB (${res[2].free} MB Free)`
    })
    $.get('./getTemp', (res) => {
      document.getElementById("temp").innerHTML = `<a class="panel-block" id="temp">
        <span class="panel-icon">
          <i class="fas fa-thermometer-three-quarters" aria-hidden="true"></i>
        </span>
        ${res[0].current}° (MAX ${res[1].maxtemp}°)`
    })
  }
  setInterval(updateUptime, 1000);
});