import { Player } from "../../player/entities/Player";
export interface Element {
    x : Number;
    y : Number; 
}

export interface Board {
    size: number;
    elements: Array<Element>;
}