import { Colors } from "../../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect } from "../../Widgets/AGUI";
import { ADrawTextFit, AFillRect, AStrokeRect } from "../../Widgets/Common";
import { ResponseMenuState } from "../ResponseMenuState";

export class TriggerModeInfo extends AGUIItem {
    private readonly _state: ResponseMenuState;
    private readonly _rect: IRect;
    private readonly _sect: IRect[];
    private readonly Modes: ResponsiveTriggerMode[] = ['activity', 'orgasm', 'spicer'];

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;

        const sectWidth = rect.width / this.Modes.length;
        this._sect = Array.from({ length: this.Modes.length }, (_, index) => {
            return {
                x: rect.x + sectWidth * index,
                y: rect.y,
                width: sectWidth,
                height: rect.height
            };
        });
    }

    Draw(hasFocus: boolean): void {
        this._state.asBaseTrigger(t => {
            const mode = t.mode;

            AFillRect(this._rect, "White");
            if (hasFocus) this._sect.forEach((v, i) => {
                if (WithinRect({ x: MouseX, y: MouseY }, v)) AFillRect(v, Colors.Hover);
                else if (mode === this.Modes[i]) AFillRect(v, Colors.Active);
            });
            this._sect.forEach((v, i) => { AStrokeRect(v); ADrawTextFit(v, this.Modes[i]); });
        });
    }

    Click(mouse: IPoint): void {
        this._state.asBaseTrigger(t => {
            this._sect.forEach((v, i) => {
                if (WithinRect(mouse, v)) {
                    t.mode = this.Modes[i];
                }
            });
        });
    }
}
