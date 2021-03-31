import { Component } from 'react';

export function setStateWithPromise<S>(reactComponent: Component, partialStateOrUpdater: S): Promise<S> {
    return new Promise((resolve, reject) => {
        reactComponent.setState(partialStateOrUpdater, () => {
            resolve();
        });
    });
}