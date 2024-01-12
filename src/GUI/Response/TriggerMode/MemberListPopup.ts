import { Styles } from "../../../Definition";
import { GetText } from "../../../i18n";
import { GUISettingScreen } from "../../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../../Widgets/AGUI";
import { TextRoundButton } from "../../Widgets/Button";
import { ADrawCircleRect, ADrawCricleIconButton, ADrawCricleTextButton, ADrawRoundRect, ADrawTextFit, RoundFramedRect } from "../../Widgets/Common";
import { InputItem, TextAreaItem } from "../../Widgets/InputText";
import { PageDial, PageDialBinding } from "../../Widgets/PageDial";
import { Popup } from "../../Widgets/Popup";
import { BasicText } from "../../Widgets/Text";

const centerX = 1000;
const centerY = 500;

const dialogPadding = 35;

const titleFontSize = 36;

const tableInnerSpacing = 5;
const memberTableTitleHeight = 50;
const memberTableRowHeight = 50;
const memberTableColumnWidth = 260;

const roundButtonWidth = 40;

const memberTableRowsPerPage = 5;
const tableHeight = memberTableTitleHeight + memberTableRowHeight * memberTableRowsPerPage;
const tableWidth = memberTableColumnWidth * 2;

const pageButtonWidth = 100;
const pagePanelWidth = 300;
const pageDisplayWidth = 120;

const buttonWidth = 200;
const buttonHeight = 50;

const memberTableTotalHeight = tableHeight + tableInnerSpacing + buttonHeight;
const memberTableTotalWidth = Math.max(tableWidth + (tableInnerSpacing + roundButtonWidth) * 2, pagePanelWidth);

const confirmCancelTotalWidth = buttonWidth * 2 + dialogPadding;

const dialogTotalWidth = Math.max(memberTableTotalWidth, buttonWidth * 2 + dialogPadding);
const dialogTotalHeight = titleFontSize + dialogPadding + Styles.Input.height + dialogPadding + memberTableTotalHeight + dialogPadding + buttonHeight;

class MemberList extends AGUIItem {
    private readonly _table: IRect;

    private readonly _page_panel: IRect;
    private readonly _page_display: IRect;

    private readonly memberList: number[];

    private pageBinding: PageDialBinding;

    private pageDial: PageDial;

    constructor(rect: IRect, memberList: number[]) {
        super();
        this.memberList = memberList;

        this._table = {
            x: rect.x + tableInnerSpacing + roundButtonWidth,
            y: rect.y,
            width: tableWidth,
            height: memberTableTitleHeight + memberTableRowHeight * memberTableRowsPerPage
        };

        this._page_panel = {
            x: rect.x + rect.width / 2 - pagePanelWidth / 2,
            y: rect.y + this._table.height + tableInnerSpacing,
            width: pagePanelWidth,
            height: buttonHeight
        };

        this._page_display = {
            x: rect.x + rect.width / 2 - pageDisplayWidth / 2,
            y: this._page_panel.y,
            width: pageDisplayWidth,
            height: buttonHeight
        };

        this.pageBinding = {
            page: 0,
            maxPage: 0,
            update: () => { }
        };

        this.pageDial = new PageDial(this._page_panel, this.pageBinding);
    }

    Draw(hasFocus: boolean): void {
        this.pageBinding.maxPage = Math.ceil(this.memberList.length / memberTableRowsPerPage);

        ADrawRoundRect(this._table, Styles.Dialog.roundRadius);

        MainCanvas.strokeStyle = "Gray";
        MainCanvas.lineWidth = 2;
        MainCanvas.beginPath();
        MainCanvas.moveTo(this._table.x, this._table.y + memberTableTitleHeight);
        MainCanvas.lineTo(this._table.x + this._table.width, this._table.y + memberTableTitleHeight);
        MainCanvas.stroke();
        Array.from({ length: memberTableRowsPerPage }, (_, i) => i).forEach(i => {
            const y = this._table.y + memberTableTitleHeight + memberTableRowHeight * i;
            MainCanvas.beginPath();
            MainCanvas.moveTo(this._table.x, y);
            MainCanvas.lineTo(this._table.x + this._table.width, y);
            MainCanvas.stroke();
        });

        ADrawTextFit({
            x: this._table.x,
            y: this._table.y,
            width: memberTableColumnWidth,
            height: memberTableTitleHeight
        }, GetText("CharaInfo::MemberID"));

        ADrawTextFit({
            x: this._table.x + tableInnerSpacing + memberTableColumnWidth,
            y: this._table.y,
            width: memberTableColumnWidth,
            height: memberTableTitleHeight
        }, GetText("CharaInfo::Name"));

        Array.from({ length: memberTableRowsPerPage }, (_, i) => i).forEach(i => {
            const y = this._table.y + memberTableTitleHeight + memberTableRowHeight * i;
            const width = memberTableColumnWidth;
            const height = memberTableRowHeight;
            const member = this.memberList[this.pageBinding.page * memberTableRowsPerPage + i];
            const deleteRect = {
                x: this._table.x + tableWidth + tableInnerSpacing,
                y: y + memberTableRowHeight / 2 - roundButtonWidth / 2,
                width: roundButtonWidth,
                height: roundButtonWidth
            }
            if (member) {
                ADrawTextFit({ x: this._table.x, y, width, height }, member.toString());
                const name = Player?.FriendNames?.get(member) || "???";
                ADrawTextFit({ x: this._table.x + tableInnerSpacing + memberTableColumnWidth, y, width, height }, name);
                ADrawCricleIconButton(deleteRect, "trashbin", hasFocus, { hover: "#FF4040" })
            }
        });

        this.pageDial.Draw(hasFocus);
    }

    Click(mouse: IPoint): void {
        this.pageDial.Click(mouse);
        Array.from({ length: memberTableRowsPerPage }, (_, i) => i).forEach(i => {
            const y = this._table.y + memberTableTitleHeight + memberTableRowHeight * i;
            const member = this.memberList[this.pageBinding.page * memberTableRowsPerPage + i];

            const deleteRect = {
                x: this._table.x + tableWidth + tableInnerSpacing,
                y: y + memberTableRowHeight / 2 - roundButtonWidth / 2,
                width: roundButtonWidth,
                height: roundButtonWidth
            }

            if (member && WithinRect(mouse, deleteRect)) {
                this.memberList.splice(this.memberList.indexOf(member), 1);
            }
        });
    }
}

export class MemberListPopup extends Popup {
    private readonly _dialog: IRect;
    private readonly _title: IPoint;
    private readonly _input: IRect;
    private readonly _input_confirm: IRect;

    private readonly _pageTable: IRect;

    private readonly _cancel_button: IRect;
    private readonly _confirm_button: IRect;

    private readonly title_text: string;

    private readonly source_member_list: number[];
    private readonly editing_member_list: number[];

    private text_input: InputItem;

    constructor(prev: GUISettingScreen | null, title: string, source: number[]) {
        super(prev);
        this.title_text = title;
        this.source_member_list = source;
        this.editing_member_list = source.slice();

        this._dialog = {
            x: centerX - dialogTotalWidth / 2 - dialogPadding,
            y: centerY - dialogTotalHeight / 2 - dialogPadding,
            width: dialogTotalWidth + dialogPadding * 2,
            height: dialogTotalHeight + dialogPadding * 2
        };

        this._title = { x: centerX, y: centerY - dialogTotalHeight / 2 + titleFontSize / 2 };

        this._input = {
            x: centerX - dialogTotalWidth / 2,
            y: centerY - dialogTotalHeight / 2 + titleFontSize + dialogPadding,
            width: dialogTotalWidth - buttonWidth - dialogPadding,
            height: Styles.Input.height
        };

        this._input_confirm = {
            x: centerX + dialogTotalWidth / 2 - buttonWidth,
            y: this._input.y + Styles.Input.height / 2 - buttonHeight / 2,
            width: buttonWidth,
            height: buttonHeight
        };

        this._pageTable = {
            x: centerX - memberTableTotalWidth / 2,
            y: this._input.y + this._input.height + dialogPadding,
            width: memberTableTotalWidth,
            height: memberTableTotalHeight
        };

        this._cancel_button = {
            x: centerX + confirmCancelTotalWidth / 2 - buttonWidth,
            y: centerY + dialogTotalHeight / 2 - buttonHeight,
            width: buttonWidth,
            height: buttonHeight
        };

        this._confirm_button = {
            x: centerX - confirmCancelTotalWidth / 2,
            y: this._cancel_button.y,
            width: buttonWidth,
            height: buttonHeight
        };

        this.text_input = new InputItem(this._input, "MemberNumberInput", "", GetText("Input ID"));

        this._items = [
            new RoundFramedRect(this._dialog, Styles.Dialog.roundRadius, "White"),
            new BasicText(this._title, this.title_text, { align: "center" }),
            this.text_input,
            new TextRoundButton(this._input_confirm, GetText("General::Add"), () => {
                const member_number = parseInt(this.text_input.text);
                if (!isNaN(member_number) && member_number > 0 && !this.editing_member_list.includes(member_number)) {
                    this.editing_member_list.push(member_number);
                    this.text_input.Clear();
                }
            }, () => {
                const v = parseInt(this.text_input.text);
                return !isNaN(v) && v > 0 && !this.editing_member_list.includes(v);
            }),
            new MemberList(this._pageTable, this.editing_member_list),
            new TextRoundButton(this._cancel_button, GetText("General::Cancel"), () => this.Exit()),
            new TextRoundButton(this._confirm_button, GetText("General::Confirm"), () => {
                this.source_member_list.splice(0, this.source_member_list.length, ...this.editing_member_list);
                this.Exit();
            })
        ]
    }
}