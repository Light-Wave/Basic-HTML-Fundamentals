class DataEntry {
  id;
  type;
  constructor(data) {
    this.mandatoryKeys().forEach((element) => {
      if (data[element] != null) {
        this[element] = data[element];
      } else {
        console.log(
          "Missing mandatory field " + element + " in " + data.id + "!"
        );
      }
      console.log("element: " + element + " = " + this[element]);
    });
    this.optionalKeys().forEach((element) => {
      if (data[element] != null) {
        this[element] = data[element];
      }
      console.log("element: " + element + " = " + this[element]);
    });

    console.log("(super) this.imgSrc: " + this.imgSrc);
  }
  resolveCopyFrom(data) {
    Object.keys(this).forEach((element) => {
      if (data[element] != null) {
        this[element] = data[element];
      }
    });
  }
  mandatoryKeys() {
    return ["id", "type"];
  }
  optionalKeys() {
    return [];
  }
}

class SvgHolder extends DataEntry {
  constructor(data) {
    super(data);
    if (data.color == null) {
      this.color = "black";
    }
    console.log("this.imgSrc: " + this.imgSrc);
    if (!this.imgSrc.includes(".svg")) {
      this.imgSrc = this.imgSrc + ".svg";
    }
    startAsync(1);
    fetch("../icons/ffffff/transparent/1x1/" + this.imgSrc)
      .then((r) => r.text())
      .then((text) => {
        this.img = text.replace("#fff", this.color);

        endAsync();
      });
  }
  resolveCopyFrom(data) {
    super.resolveCopyFrom(data);
    if (data.imgSrc != null) {
      this.imgSrc = data.imgSrc;
      if (!this.imgSrc.includes(".svg")) {
        this.imgSrc = this.imgSrc + ".svg";
      }
      startAsync(1);
      fetch("../icons/ffffff/transparent/1x1/" + this.imgSrc)
        .then((r) => r.text())
        .then((text) => {
          this.img = text.replace("#fff", this.color);

          endAsync();
        });
    }
  }
  mandatoryKeys() {
    return super.mandatoryKeys().concat(["imgSrc"]);
  }
  optionalKeys() {
    return super.optionalKeys().concat(["color"]);
  }
}

class Race extends SvgHolder {
  constructor(data) {
    super(data);
  }
  mandatoryKeys() {
    return super.mandatoryKeys().concat(["name"]);
  }
  optionalKeys() {
    return super.optionalKeys().concat(["consumption", "production"]);
  }
}

let human = new Race({
  id: "human",
  type: "race",
  name: "Human",
  imgSrc: "delapouite/person",
  color: "beige",
  consumption: [{ wheat: 1 }],
  production: [{ money: 1 }],
});
console.log(human);
