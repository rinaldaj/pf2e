import { ItemDataPF2e } from '@item/data-definitions';
import { CharacterData, NPCData } from '@actor/data-definitions';
import { PF2RuleElement } from '../rule-element';

/**
 * @category RuleElement
 */
export class PF2TokenEffectIconRuleElement extends PF2RuleElement {
    onCreate(actorData: CharacterData | NPCData, item: ItemDataPF2e, actorUpdates: any, tokens: any[]) {
        const value = this.ruleData.value ?? item.img ?? 'systems/pf2e/icons/default-icons/mystery-man.svg';
        const safeValue = value.replace(/[.]/g, '-');

        // add the token effect if it is missing
        for (const token of tokens) {
            if (!token.effects.includes(value)) {
                token.effects.push(value);
            }
        }

        // add the item ID to the source flag for the token effect
        const effects =
            getProperty(actorUpdates, 'flags.pf2e.token.effects') ??
            getProperty(actorData, 'flags.pf2e.token.effects') ??
            {};
        mergeObject(actorUpdates, { 'flags.pf2e.token.effects': {} }, { inplace: true });
        const sources = effects[safeValue] ?? [];
        if (!sources.includes(item._id)) {
            sources.push(item._id);
        }
        getProperty(actorUpdates, 'flags.pf2e.token.effects')[safeValue] = sources;
    }

    onDelete(actorData: CharacterData | NPCData, item: ItemDataPF2e, actorUpdates: any, tokens: any[]) {
        const value = this.ruleData.value ?? item.img ?? 'systems/pf2e/icons/default-icons/mystery-man.svg';
        const safeValue = value.replace(/[.]/g, '-');
        const effects =
            getProperty(actorUpdates, 'flags.pf2e.token.effects') ??
            getProperty(actorData, 'flags.pf2e.token.effects') ??
            {};
        mergeObject(actorUpdates, { 'flags.pf2e.token.effects': {} }, { inplace: true });
        const sources = effects[safeValue] ?? [];
        if (sources.includes(item._id)) {
            sources.splice(
                sources.findIndex((source) => source === item._id),
                1,
            );
        }
        if (sources.length === 0) {
            // remove the token effect since this was the last source
            for (const token of tokens) {
                if (token.effects.includes(value)) {
                    token.effects = token.effects.filter((fx) => value !== fx);
                }
            }
            // remove the source list for this effect
            getProperty(actorUpdates, 'flags.pf2e.token.effects')[`-=${safeValue}`] = null;
        } else {
            // remove this item as a source for the token effect
            getProperty(actorUpdates, 'flags.pf2e.token.effects')[safeValue] = sources;
        }
    }

    onCreateToken(_actorData: CharacterData | NPCData, item: ItemDataPF2e, token: TokenData) {
        token.effects = token.effects ?? [];
        if (!token.effects.includes(item.img)) {
            token.effects.push(item.img);
        }
    }
}
