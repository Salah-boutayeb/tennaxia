<script>
export default {
    props: {
        steps: {
            type: Array,
            required: true,
            validator(arr) {
                return arr.length <= 5 && arr.every((obj) => ['label'].every((key) => key in obj));
            }
        },
        currentStep: {
            type: Number,
            default: 1
        },
        completedStep: {
            type: Number,
            default: 0
        },
        disableNavigation: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        isStepCurrent(index) {
            return index + 1 === this.currentStep;
        },
        isStepCompleted(index) {
            return index + 1 !== this.currentStep && this.completedStep >= index + 1;
        },
        isStepNavigable(index) {
            return this.completedStep >= index;
        }
    }
};
</script>

<template>
    <ol class="stepProgressBar">
        <li
            v-for="(step, index) in steps"
            :key="index"
            class="stepProgressBar__step"
            :class="{
                'stepProgressBar__step--current': isStepCurrent(index),
                'stepProgressBar__step--completed': isStepCompleted(index),
                'stepProgressBar__step--navigable': isStepNavigable(index)
            }"
        >
            <div v-if="index > 0" class="stepProgressBar__step__line"></div>
            <button class="stepProgressBar__step__button" type="button" :disabled="disableNavigation && !isStepNavigable(index)" @click="$emit('step-clicked', index + 1)">
                <span class="stepProgressBar__step__button__indicator">
                    <svg v-if="isStepCompleted(index)" class="stepProgressBar__step__button__indicator__icon-completed" width="10" height="7" viewBox="0 0 12 9" fill="currentColor">
                        <path
                            d="M1.05025 3.70714C1.44077 3.31661 2.07394 3.31661 2.46446 3.70714L5.29289 6.53556C5.68341 6.92609 5.68341 7.55925 5.29289 7.94978C4.90236 8.3403 4.2692 8.3403 3.87867 7.94978L1.05025 5.12135C0.659724 4.73083 0.659724 4.09766 1.05025 3.70714Z"
                        />
                        <path
                            d="M10.9498 0.878709C11.3403 1.26923 11.3403 1.9024 10.9498 2.29292L5.29289 7.94978C4.90236 8.3403 4.2692 8.3403 3.87867 7.94978C3.48815 7.55925 3.48816 6.92609 3.87869 6.53556L9.53554 0.878709C9.92606 0.488184 10.5592 0.488184 10.9498 0.878709Z"
                        />
                    </svg>
                </span>
                <span class="stepProgressBar__step__button__label">
                    {{ step.label }}
                </span>
            </button>
        </li>
    </ol>
</template>

<style scoped>
/*
 Global/reset css styles, imported from:
 'https://dora.michalostamou.me/global.css'
 @see https://github.com/dora-micha/global-css
*/

/*
  Component styles
*/
.stepProgressBar {
    --stepProgressBar-space-unit: 4px;
    --stepProgressBar-indicator-size: 16px;
    --stepProgressBar-font-size: 14px;
    --stepProgressBar-step-size: 80px;
    --stepProgressBar-step-line-size: 2px;
    --stepProgressBar-color-primary: #3f0fff;
    --stepProgressBar-color-secondary: #d1d5db;
    --stepProgressBar-color-neutral: #fff;
    --stepProgressBar-color-neutral-400: #a3a3a3;
    --stepProgressBar-color-neutral-800: #262626;
    display: flex;
    width: 100%;
}

.stepProgressBar__step {
    display: flex;
}

.stepProgressBar__step:not(:first-child) {
    width: 100%;
}

/* --- button ---- */
.stepProgressBar__step__button {
    align-items: center;
    color: var(--stepProgressBar-color-neutral-400);
    display: flex;
    font-size: var(--stepProgressBar-font-size);
    flex-direction: column;
    flex-shrink: 0;
    position: relative;
    transition: color 0.2s ease-in;
    width: var(--stepProgressBar-step-size);
}

.stepProgressBar__step--current .stepProgressBar__step__button {
    color: var(--stepProgressBar-color-neutral-800);
}

.stepProgressBar__step__button__indicator {
    align-items: center;
    background-color: var(--stepProgressBar-color-secondary);
    border: calc(var(--stepProgressBar-indicator-size) / 3.5) solid var(--stepProgressBar-color-neutral);
    border-radius: 100%;
    display: flex;
    justify-content: center;
    height: var(--stepProgressBar-indicator-size);
    transition: background-color 0.3s ease-in;
    width: var(--stepProgressBar-indicator-size);
}

.stepProgressBar__step--current .stepProgressBar__step__button__indicator {
    background-color: var(--stepProgressBar-color-neutral);
    border: calc(var(--stepProgressBar-indicator-size) / 4) solid var(--stepProgressBar-color-primary);
    transition: all 0.3s ease-in;
}

.stepProgressBar__step--completed .stepProgressBar__step__button__indicator {
    border: 0;
    transition: all 0.3s ease-in;
}

.stepProgressBar__step:not(.stepProgressBar__step--current).stepProgressBar__step--navigable .stepProgressBar__step__button__indicator {
    background-color: var(--stepProgressBar-color-primary);
    transition: all 0.3s ease-in;
}

.stepProgressBar__step__button__indicator__icon-completed {
    fill: transparent;
}

.stepProgressBar__step--completed .stepProgressBar__step__button__indicator__icon-completed {
    animation: fillColorChange 0.2s ease-in 0.3s forwards;
}

.stepProgressBar__step__button__label {
    margin-top: var(--stepProgressBar-space-unit);
}

/* --- button states ---- */

@supports selector(:hover) {
    .stepProgressBar__step__button:hover {
        color: var(--stepProgressBar-color-primary);
    }
    .stepProgressBar__step:not(.stepProgressBar__step--current) .stepProgressBar__step__button:hover .stepProgressBar__step__button__indicator {
        background-color: var(--stepProgressBar-color-primary);
    }
}

.stepProgressBar__step__button:focus-visible {
    border-radius: 4px;
    outline: var(--stepProgressBar-color-primary) solid 2px;
}

@supports not selector(:focus-visible) {
    /* fallback for browsers without focus-visible support */
    .stepProgressBar__step__button:focus {
        border-radius: 4px;
        outline: var(--stepProgressBar-color-primary) solid 2px;
    }
}

/* --- line ---- */
.stepProgressBar__step__line {
    background-color: var(--stepProgressBar-color-secondary);
    height: var(--stepProgressBar-step-line-size);
    margin-top: calc(var(--stepProgressBar-indicator-size) / 2 - var(--stepProgressBar-step-line-size) / 2);
    margin-left: calc(var(--stepProgressBar-step-size) / 2 * -1);
    margin-right: calc(var(--stepProgressBar-step-size) / 2 * -1);
    transition: background-color 0.3s ease-in;
    width: 100%;
}

.stepProgressBar__step--navigable .stepProgressBar__step__line {
    background-color: var(--stepProgressBar-color-primary);
    transition: background-color 0.2s ease-in;
}

/* --- other ---- */

@keyframes fillColorChange {
    0% {
        fill: var(--stepProgressBar-color-primary);
    }
    100% {
        fill: var(--stepProgressBar-color-neutral);
    }
}

/* This media query is based on step-size * 5,
    if you change the value of it update it here too
 */
@media (max-width: 400px) {
    .stepProgressBar__step__button {
        width: auto;
    }

    .stepProgressBar__step__line {
        margin-left: 0;
        margin-right: 0;
    }

    .stepProgressBar__step__button__label {
        display: none;
    }
}

/*
  Pen styles (ignore these styles)
*/
.container {
    margin: 0 auto;
    max-width: 1000px;
    min-width: 320px;
    padding: 100px 24px;
    width: 100%;
}
</style>
