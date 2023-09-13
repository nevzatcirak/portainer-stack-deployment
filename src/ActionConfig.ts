import * as core from '@actions/core';
import * as fs from 'fs';
import mustache from 'mustache';
import {Config, PortainerCredentials, StackParams} from "./types";

const getPortainerCredentials = (): PortainerCredentials => {
    return {
        url: new URL(core.getInput('url', {required: true})),
        username: core.getInput('username', {required: true}),
        password: core.getInput('password', {required: true}),
        environment_id: parseInt(core.getInput('environment_id', {required: true}))
    };
}

const getStackParams = (): StackParams => {
    const filePath = core.getInput('stack_file_path', {required: true});
    let file = fs.readFileSync(filePath, 'utf-8');

    if (filePath.split('.').pop() === 'mustache') {
        mustache.escape = JSON.stringify;
        file = mustache.render(file, JSON.parse(core.getInput('variables', {required: false})));
    }

    return {
        name: core.getInput('stack_name', {required: true}),
        file,
        delete: !!core.getInput('delete', {required: false}).length,
        prune: !!core.getInput('prune', {required: false}).length,
        pullImage: !!core.getInput('pullImage', {required: false}).length
    };
}

export const get = (): Config => {
    return {
        portainer: getPortainerCredentials(),
        stack: getStackParams()
    };
}
