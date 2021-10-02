import { Rarity } from "@module/data";
import { adjustDCByRarity, calculateDC } from "@module/dc";
import { ItemPF2e } from "../index";
import { CraftingFormulaData, FormulaData } from "./data";

export class CraftingFormula implements CraftingFormulaData {
    uuid: CompendiumUUID;
    img: ImagePath;
    name: string;
    _level?: number;
    _dc?: number;
    description: string;
    price: string;
    _rarity?: Rarity;

    constructor(data: CraftingFormulaData) {
        this._dc = data.dc;
        this._level = data.level;
        this.name = data.name;
        this._rarity = data.rarity;
        this.uuid = data.uuid;
        this.description = data.description;
        this.price = data.price;
        this.img = data.img;
    }

    get dc(): number {
        return this._dc ?? adjustDCByRarity(calculateDC(this.level), this.rarity);
    }

    get level(): number {
        return this._level ?? 0;
    }

    get rarity(): Rarity {
        return this._rarity ?? "common";
    }
}

export class FormulaPF2e extends ItemPF2e {
    static override get schema(): typeof FormulaData {
        return FormulaData;
    }
}

export interface FormulaPF2e {
    readonly data: FormulaData;
}
