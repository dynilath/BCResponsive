import { DataManager } from "../../../Data";
import { Styles } from "../../../Definition";
import { i18n } from "../../../i18n";
import { IGUIScreen } from "../../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../../Widgets/AGUI";
import { TextRoundButton } from "../../Widgets/Button";
import { ADrawCricleIconButton, ADrawRoundRect, ADrawTextFit } from "../../Widgets/Common";
import { RoundFramedRect } from "../../Widgets/Rect";
import { TextInput } from "../../Widgets/InputText";
import { PageDial, PageDialBinding } from "../../Widgets/PageDial";
import { Popup } from "../../Widgets/Popup";
import { Scrollbar } from "../../Widgets/Scrollbar";
import { BasicText } from "../../Widgets/Text";

const TITLE_FONT_SIZE = 36;

const TABLE_INNER_SPACING = 5;
const MEMBER_TABLE_TITLE_HEIGHT = 50;
const MEMBER_TABLE_ROW_HEIGHT = 50;
const MEMBER_TABLE_COLUMN_WIDTH = 260;

const REMOVE_BUTTON_DIAMETER = 40;

const MEMBER_TABLE_ROWS_PER_PAGE = 7;
const MEMBER_TABLE_HEIGHT = MEMBER_TABLE_TITLE_HEIGHT + MEMBER_TABLE_ROW_HEIGHT * MEMBER_TABLE_ROWS_PER_PAGE;
const MEMBER_TABLE_WIDTH = MEMBER_TABLE_COLUMN_WIDTH * 2;

const TOTAL_MEMBER_TABLE_HEIGHT = MEMBER_TABLE_HEIGHT;
const TOTAL_MEMBER_TABLE_WIDTH = MEMBER_TABLE_WIDTH + TABLE_INNER_SPACING + REMOVE_BUTTON_DIAMETER + Styles.Scrollbar.spacing + Styles.Scrollbar.width;

const TOTAL_DIALOG_WIDTH = Math.max(TOTAL_MEMBER_TABLE_WIDTH, Styles.Dialog.control_button_width * 2 + Styles.Dialog.padding);
const TOTAL_DIALOG_HEIGHT = TITLE_FONT_SIZE + Styles.Dialog.padding + Styles.Input.height + Styles.Dialog.padding + TOTAL_MEMBER_TABLE_HEIGHT + Styles.Dialog.padding + Styles.Dialog.control_button_height;

class MemberList extends AGUIItem {
    private readonly _table: IRect;
    private readonly scrollbar: Scrollbar;

    constructor(readonly rect: IRect, readonly memberList: number[]) {
        super();

        this._table = {
            x: rect.x + TABLE_INNER_SPACING + REMOVE_BUTTON_DIAMETER,
            y: rect.y,
            width: MEMBER_TABLE_WIDTH,
            height: MEMBER_TABLE_TITLE_HEIGHT + MEMBER_TABLE_ROW_HEIGHT * MEMBER_TABLE_ROWS_PER_PAGE
        };

        const scrollbar_rect = {
            x: rect.x + rect.width - Styles.Scrollbar.width,
            y: rect.y,
            width: Styles.Scrollbar.width,
            height: rect.height
        }

        this.scrollbar = new Scrollbar({
            content_rows: this.memberList.length,
            container_rows: MEMBER_TABLE_ROWS_PER_PAGE
        }, scrollbar_rect);
    }

    Draw(hasFocus: boolean): void {
        this.scrollbar.update(this.memberList.length, MEMBER_TABLE_ROWS_PER_PAGE);

        ADrawRoundRect(this._table, Styles.Dialog.roundRadius);

        MainCanvas.strokeStyle = "Gray";
        MainCanvas.lineWidth = 2;
        MainCanvas.beginPath();
        MainCanvas.moveTo(this._table.x, this._table.y + MEMBER_TABLE_TITLE_HEIGHT);
        MainCanvas.lineTo(this._table.x + this._table.width, this._table.y + MEMBER_TABLE_TITLE_HEIGHT);
        MainCanvas.stroke();
        Array.from({ length: MEMBER_TABLE_ROWS_PER_PAGE }, (_, i) => i).forEach(i => {
            const y = this._table.y + MEMBER_TABLE_TITLE_HEIGHT + MEMBER_TABLE_ROW_HEIGHT * i;
            MainCanvas.beginPath();
            MainCanvas.moveTo(this._table.x, y);
            MainCanvas.lineTo(this._table.x + this._table.width, y);
            MainCanvas.stroke();
        });

        ADrawTextFit({
            x: this._table.x,
            y: this._table.y,
            width: MEMBER_TABLE_COLUMN_WIDTH,
            height: MEMBER_TABLE_TITLE_HEIGHT
        }, i18n("CharaInfo::MemberID"));

        ADrawTextFit({
            x: this._table.x + TABLE_INNER_SPACING + MEMBER_TABLE_COLUMN_WIDTH,
            y: this._table.y,
            width: MEMBER_TABLE_COLUMN_WIDTH,
            height: MEMBER_TABLE_TITLE_HEIGHT
        }, i18n("CharaInfo::Name"));

        Array.from({ length: MEMBER_TABLE_ROWS_PER_PAGE }, (_, i) => i).forEach(i => {
            const targetIdx = this.scrollbar.offset + i;
            const member = this.memberList[targetIdx];
            if (member) {
                const y = this._table.y + MEMBER_TABLE_TITLE_HEIGHT + MEMBER_TABLE_ROW_HEIGHT * i;
                const width = MEMBER_TABLE_COLUMN_WIDTH;
                const height = MEMBER_TABLE_ROW_HEIGHT;
                const deleteRect = {
                    x: this._table.x - TABLE_INNER_SPACING - REMOVE_BUTTON_DIAMETER,
                    y: y + MEMBER_TABLE_ROW_HEIGHT / 2 - REMOVE_BUTTON_DIAMETER / 2,
                    width: REMOVE_BUTTON_DIAMETER,
                    height: REMOVE_BUTTON_DIAMETER
                }

                ADrawTextFit({ x: this._table.x, y, width, height }, member.toString());
                const name = Player?.FriendNames?.get(member) || "???";
                ADrawTextFit({ x: this._table.x + TABLE_INNER_SPACING + MEMBER_TABLE_COLUMN_WIDTH, y, width, height }, name);
                ADrawCricleIconButton(deleteRect, "trashbin", hasFocus, { hover: "#FF4040" })
            }
        });

        this.scrollbar.Draw(hasFocus);
    }

    Click(mouse: IPoint): void {
        Array.from({ length: MEMBER_TABLE_ROWS_PER_PAGE }, (_, i) => i).forEach(i => {
            const y = this._table.y + MEMBER_TABLE_TITLE_HEIGHT + MEMBER_TABLE_ROW_HEIGHT * i;
            const targetIdx = this.scrollbar.offset + i;
            const member = this.memberList[targetIdx];

            const deleteRect = {
                x: this._table.x - TABLE_INNER_SPACING - REMOVE_BUTTON_DIAMETER,
                y: y + MEMBER_TABLE_ROW_HEIGHT / 2 - REMOVE_BUTTON_DIAMETER / 2,
                width: REMOVE_BUTTON_DIAMETER,
                height: REMOVE_BUTTON_DIAMETER
            }

            if (member && WithinRect(mouse, deleteRect)) {
                this.memberList.splice(this.memberList.indexOf(member), 1);
            }
        });
        this.scrollbar.Click(mouse);
    }

    MouseWheel(event: WheelEvent): void {
        this.scrollbar.MouseWheel(event);
        if (WithinRect({ x: MouseX, y: MouseY }, this._table)) this.scrollbar.RawMouseWheel(event);
    }
}

export class MemberListPopup extends Popup {

    private readonly source_member_list: number[];
    private readonly editing_member_list: number[];

    constructor(readonly prev: IGUIScreen | null, readonly title: string, readonly source: number[]) {
        super(prev);
        this.source_member_list = source;
        this.editing_member_list = [...source];

        const _dialog = {
            x: Styles.Screen.center_x - TOTAL_DIALOG_WIDTH / 2 - Styles.Dialog.padding,
            y: Styles.Screen.center_y - TOTAL_DIALOG_HEIGHT / 2 - Styles.Dialog.padding,
            width: TOTAL_DIALOG_WIDTH + Styles.Dialog.padding * 2,
            height: TOTAL_DIALOG_HEIGHT + Styles.Dialog.padding * 2
        };

        const _title = { x: Styles.Screen.center_x, y: Styles.Screen.center_y - TOTAL_DIALOG_HEIGHT / 2 + TITLE_FONT_SIZE / 2 };

        const _input = {
            x: Styles.Screen.center_x - TOTAL_DIALOG_WIDTH / 2,
            y: Styles.Screen.center_y - TOTAL_DIALOG_HEIGHT / 2 + TITLE_FONT_SIZE + Styles.Dialog.padding,
            width: TOTAL_DIALOG_WIDTH - Styles.Dialog.control_button_width - Styles.Dialog.padding,
            height: Styles.Input.height
        };

        const _input_confirm = {
            x: Styles.Screen.center_x + TOTAL_DIALOG_WIDTH / 2 - Styles.Dialog.control_button_width,
            y: _input.y + Styles.Input.height / 2 - Styles.Dialog.control_button_height / 2,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const _pageTable = {
            x: Styles.Screen.center_x - TOTAL_MEMBER_TABLE_WIDTH / 2,
            y: _input.y + _input.height + Styles.Dialog.padding,
            width: TOTAL_MEMBER_TABLE_WIDTH,
            height: TOTAL_MEMBER_TABLE_HEIGHT
        };


        const _confirm_button = {
            x: Styles.Screen.center_x - Styles.Dialog.padding / 2 - Styles.Dialog.control_button_width,
            y: _pageTable.y + _pageTable.height + Styles.Dialog.padding,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const _cancel_button = {
            x: Styles.Screen.center_x + Styles.Dialog.padding / 2,
            y: _confirm_button.y,
            width: Styles.Dialog.control_button_width,
            height: Styles.Dialog.control_button_height
        };

        const text_input = new TextInput(_input, "MemberNumberInput", "", i18n("MemberListPopup::InputID"));

        this.items = [
            new RoundFramedRect(_dialog, Styles.Dialog.roundRadius, "White"),
            new BasicText(_title, title, { align: "center", emphasis: true }),
            text_input,
            new TextRoundButton(_input_confirm, i18n("General::Add"), () => {
                const member_number = parseInt(text_input.text);
                if (!isNaN(member_number) && member_number > 0 && !this.editing_member_list.includes(member_number)) {
                    this.editing_member_list.push(member_number);
                    text_input.Clear();
                }
            }, () => {
                const v = parseInt(text_input.text);
                return !isNaN(v) && v > 0 && !this.editing_member_list.includes(v);
            }),
            new MemberList(_pageTable, this.editing_member_list),
            new TextRoundButton(_cancel_button, i18n("General::Cancel"), () => this.Exit()),
            new TextRoundButton(_confirm_button, i18n("General::Confirm"), () => {
                this.source_member_list.splice(0, this.source_member_list.length, ...this.editing_member_list);
                DataManager.save();
                this.Exit();
            })
        ]
    }
}