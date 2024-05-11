import type { Rectangle } from "electron";
import Store from "electron-store";

interface StoreT {
  bounds: Rectangle;
}

class AppStore {
  public DEFAULT_BOUNDS: Rectangle = {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  };
  private store: Store<StoreT>;
  constructor() {
    this.store = new Store<StoreT>();
    if (!this.store.has("bounds")) {
      this.store.set("bounds", this.DEFAULT_BOUNDS);
    }
  }
  public setBounds(bounds: Rectangle) {
    this.store.set("bounds", bounds);
  }
  public getBounds() {
    return this.store.get("bounds");
  }
}

export const store = new AppStore();
