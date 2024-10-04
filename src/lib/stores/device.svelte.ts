export interface Device {
  id: number;
  name: string;
  imageUrl: string;
  battery: number;
  lastSeen: string;
  location: {
    latitude: number;
    longitude: number;
  }
}

function createDeviceStore() {
  let devices = $state<Device[]>([]);
  let selected = $state<Device | null>(null);

  return {
    get devices() { return devices },
    get selected() { return selected },
    addDevice: (device: Device) => {
      devices.push(device);
    },
    updateDevice: (id: number, newData: Partial<Device>) => {
      const device = devices.find(d => d.id === id);
      if (device) {
        Object.assign(device, newData);
      }
    },
    removeDevice: (id: number) => {
      devices.splice(devices.findIndex(d => d.id === id), 1);
    },
    setDevices: (newDevices: Device[]) => {
      devices = newDevices;
    },
    selectDevice: (id: number) => {
      selected = devices.find(d => d.id === id) || null;
    },
    unselectAll: () => {
      selected = null;
    }
  };
}

export const deviceStore = createDeviceStore();