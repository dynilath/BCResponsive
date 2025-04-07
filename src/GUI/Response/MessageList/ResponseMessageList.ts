import { GUISetting } from '../../GUI';
import { AGUIItem, IPoint, IRect, WithinRect } from '../../Widgets/AGUI';
import { ADrawCircleRect, ADrawCricleTextButton, ADrawIcon, ADrawRoundRect, ADrawTextFit } from '../../Widgets/Common';
import { MessageSettinPopup } from './MessageSettingPopup';
import { ResponseMenuState } from '../ResponseMenuState';
import { TriggerSetting } from '../ResponseMenu';
import { i18n } from '../../../i18n';
import { Styles } from '../../../Definition';
import { DataManager } from '../../../Data';
import { Scrollbar } from '../../Widgets/Scrollbar';

const ROUND_BUTTON_DIAMETER = 40;

function DrawMessageItem (message: ResponseMessage, active: boolean, mouse: IPoint, rect: IRect) {
    if (active && WithinRect(mouse, rect)) ADrawCircleRect(rect, { fill: Styles.Button.hover });
    else ADrawCircleRect(rect);

    const _icon_rect = {
        x: rect.x + rect.height / 2 - ROUND_BUTTON_DIAMETER / 2,
        y: rect.y + rect.height / 2 - ROUND_BUTTON_DIAMETER / 2,
        width: ROUND_BUTTON_DIAMETER,
        height: ROUND_BUTTON_DIAMETER,
    };

    const _text_rect = {
        x: rect.x + rect.height,
        y: rect.y,
        width: rect.width - rect.height,
        height: rect.height,
    };

    if (message.type === 'message') ADrawIcon(_icon_rect, 'chat');
    else if (message.type === 'action') ADrawIcon(_icon_rect, 'gesture');

    ADrawTextFit(_text_rect, message.content);
}

const ITEM_HEIGHT = 60;
const ITEM_SPACING = 10;

export class ResponseMessageList extends AGUIItem {
    private readonly _items_per_page: number;
    private readonly _list_rect: IRect;
    private readonly _itemRects: IRect[];

    private scrollbar: Scrollbar;

    constructor (readonly parent: TriggerSetting, readonly state: ResponseMenuState, readonly rect: IRect) {
        super();

        this._items_per_page = Math.floor((rect.height - ITEM_SPACING) / (ITEM_HEIGHT + ITEM_SPACING));

        this._list_rect = {
            x: rect.x,
            y: rect.y,
            width: rect.width - Styles.Scrollbar.width - Styles.Scrollbar.spacing,
            height: rect.height,
        };

        this._itemRects = Array.from({ length: this._items_per_page }, (_, index) => {
            return {
                x: this._list_rect.x + ITEM_SPACING,
                y: this._list_rect.y + ITEM_SPACING + (ITEM_HEIGHT + ITEM_SPACING) * index,
                width: this._list_rect.width - ITEM_SPACING * 2,
                height: ITEM_HEIGHT,
            };
        });

        const scrollbar_rect = {
            x: rect.x + rect.width - Styles.Scrollbar.width,
            y: rect.y,
            width: Styles.Scrollbar.width,
            height: rect.height,
        };

        this.scrollbar = new Scrollbar(
            {
                content_rows: this.state.targetItem?.messages.length ?? 0 + 1,
                container_rows: this._items_per_page,
            },
            scrollbar_rect
        );
    }

    Draw (hasFocus: boolean): void {
        if (this.state.targetItem === null) return;

        this.scrollbar.update(this.state.targetItem.messages.length + 1, this._itemRects.length);

        const mouse = { x: MouseX, y: MouseY };
        const t_item = this.state.targetItem;

        ADrawRoundRect(this._list_rect, ITEM_HEIGHT / 2 + ITEM_SPACING);

        this._itemRects.forEach((v, i) => {
            const targetIndex = this.scrollbar.offset + i;
            const tmessage = t_item.messages[targetIndex];

            if (tmessage) {
                DrawMessageItem(tmessage, hasFocus, mouse, v);
            } else if (t_item.messages.length === targetIndex) {
                ADrawCricleTextButton(v, i18n('TriggerInfo::NewResponses'), hasFocus, { stroke: 'DarkGrey' });
            }
        });

        this.scrollbar.Draw(hasFocus);
    }

    Click (mouse: IPoint): void {
        if (this.state.targetItem === null) return;
        const t_item = this.state.targetItem;

        if (WithinRect(mouse, this._list_rect)) {
            this._itemRects.forEach((v, i) => {
                const targetIndex = this.scrollbar.offset + i;
                const tmessage = t_item.messages[targetIndex];
                if (tmessage && WithinRect(mouse, v)) {
                    GUISetting.setScreen(
                        new MessageSettinPopup(
                            this.parent,
                            tmessage,
                            msg => {
                                t_item.messages[targetIndex] = msg;
                                DataManager.save();
                            },
                            _ => {
                                t_item.messages.splice(targetIndex, 1);
                                DataManager.save();
                            }
                        )
                    );
                } else if (t_item.messages.length === targetIndex && WithinRect(mouse, v)) {
                    GUISetting.setScreen(
                        new MessageSettinPopup(
                            this.parent,
                            { type: 'message', content: i18n('Default::ExampleMessage') },
                            msg => {
                                t_item.messages.push(msg);
                                DataManager.save();
                            },
                            () => {}
                        )
                    );
                }
            });
        }

        this.scrollbar.Click(mouse);
    }

    MouseWheel (event: WheelEvent): void {
        if (this.state.targetItem === null) return;
        this.scrollbar.MouseWheel(event);
        if (WithinRect({ x: MouseX, y: MouseY }, this._list_rect)) this.scrollbar.RawMouseWheel(event);
    }
}
