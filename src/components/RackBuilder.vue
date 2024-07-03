<template>
  <Tabs>
    <Tab title="Ribbons">
      <Ribbons :folder="folder" />
    </Tab>
    <Tab title="Ranks">
      <Ranks :folder="folder" />
    </Tab>
    <Tab title="Badges">
      <Badges :folder="folder" />
    </Tab>
  </Tabs>

  <h2>Your Ribbon Rack</h2>
  <div class="rack-container">
    <div ref="rack" class="rack">
      <img class="badge" :src="checkedRanks" v-if="checkedRanks">

      <img class="badge" v-for="src in checkedBadges" :key="src" :src="src">

      <div class="row" v-for="ribbonRow in sortRibbons()" :key="ribbonRow">
        <div v-for="ribbon in ribbonRow" :key="ribbon[0]">
          <img class="ribbon" :src="getRibbonSvgPath(ribbon[0])">
          <div class="devices">
            <img class="oak-leaf" v-for="device in getGoldenOakCount(ribbon[1])" :key="device"
              :src="getDeviceSvgPath('golden_oak_leaf')">
            <img class="oak-leaf" v-for="device in getSilverOakCount(ribbon[1])" :key="device"
              :src="getDeviceSvgPath('silver_oak_leaf')">
            <img class="oak-leaf" v-for="device in getBronzeOakCount(ribbon[1])" :key="device"
              :src="getDeviceSvgPath('bronze_oak_leaf')">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="button-group">
    <button @click="saveRackPng">Save Rack as .PNG</button>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue';
import Tab from './Tab.vue';
import Tabs from './Tabs.vue';
import Ranks from './Ranks.vue';
import Badges from './Badges.vue';
import Ribbons from './Ribbons.vue';
import html2canvas from 'html2canvas-pro';

const props = defineProps(['folder']);

const checkedRibbons = ref([]);

function getRibbonSvgPath(id) {
  return `/src/assets/${props.folder}/ribbons/ribbons/${id}.svg`;
}

function getDeviceSvgPath(device) {
  return `/src/assets/${props.folder}/ribbons/devices/${device}.svg`;
}

function getGoldenOakCount(devices) {
  return Math.floor(devices / 5 / 5); // Golden oak for every 25 devices (5 silver x 5)
}

function getSilverOakCount(devices) {
  return Math.floor((devices % 25) / 5); // Silver oak for every 5 devices within 25
}

function getBronzeOakCount(devices) {
  return devices % 5; // Remaining bronze oak leaves
}

provide('checkedRibbons', {
  checkedRibbons,
  getRibbonSvgPath
});

const checkedRanks = ref('');

function getRankSvgPath(kind, rank) {
    if (kind !== "enlisted" || parseInt(rank.id) !== 1) {
        return `/src/assets/${props.folder}/ranks/${kind}/${rank.id}.svg`;
    }
    return '';
}

provide('checkedRanks', {
  checkedRanks,
  getRankSvgPath
});

const checkedBadges = ref([]);

function getBadgeSvgPath(id) {
    return `/src/assets/${props.folder}/badges/${id}.svg`;
}

provide('checkedBadges', {
  checkedBadges,
  getBadgeSvgPath
});

function sortRibbons() {
  const ribbons = checkedRibbons.value.map(ribbon => {
    return ribbon;
  });

  ribbons.sort((a, b) => a[0] - b[0]);

  const evenRows = ribbons.length % 3; // >1 = unven, 0 = even

  const rows = [];
  const ribbonsPerRow = 3;
  const numRows = Math.ceil(ribbons.length / ribbonsPerRow);

  for (let i = 0; i < numRows; i++) {
    // if it's uneven then 1 or 2 go on the top
    // and the reset of the ribbons follow the 3 per row princlpe
    const row = [];

    if (evenRows && i === 0) {
      // If it's an odd count of ribbons and it's the first row,
      // add 1 or 2 ribbons to the top row
      const ribbonsToAdd = Math.min(evenRows, ribbons.length);
      for (let j = 0; j < ribbonsToAdd; j++) {
        row.push(ribbons.shift());
      }
    } else {
      // Add ribbons following the 3 per row principle
      for (let j = 0; j < ribbonsPerRow && ribbons.length > 0; j++) {
        row.push(ribbons.shift());
      }
    }

    rows.push(row);
  }

  return rows;
}

const rack = ref(null);

function saveRackPng() {
  if (rack.value) {
    html2canvas(rack.value, { backgroundColor: null, scale: 4 }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'ribbon_rack.png';
      link.click();
    });
  }
}
</script>

<style scoped>
.rack-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rack {
  width: 600px;
  flex-wrap: wrap;
  justify-content: center;
}

.rack .row {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
  gap: 10px;
}

.rack .row div {
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;
}

.rack .row .devices {
  position: absolute;
  align-items: center;
  display: flex;
  justify-content: center;
}

.rack .row .devices .oak-leaf {
  position: static;
  width: 20px;
  height: 20px;
}

.rack .badge {
  width: 60px;
  height: 60px;
  margin: 2px;
  object-fit: contain;
}

.rack .ribbon {
  width: 100px;
  height: 30px;
  object-fit: contain;
}

.button-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 10px;
}
</style>
