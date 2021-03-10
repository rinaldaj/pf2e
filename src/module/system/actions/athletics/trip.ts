import { ActionDefaultOptions, ActionsPF2e } from '../actions';

export function trip(options: ActionDefaultOptions) {
    ActionsPF2e.simpleRollActionCheck(
        options.actors,
        'data.data.skills.ath',
        options.glyph ?? 'A',
        'PF2E.Actions.Trip',
        'PF2E.ActionsCheck.Athletics',
        ['all', 'skill-check', 'athletics', 'action:trip'],
        ['action:trip'],
        ['attack'],
        'skill-check',
        options.event,
    );
}
