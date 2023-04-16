import defaultConfig, { ChannelTitleMode } from "../../defaultConfig";
import { JSONStorage } from "./data_storage";

export interface ConfigProps {
    readonly displayChannelTitle: ChannelTitleMode;
    readonly maxItemPerFeed: number;
}

export class Config {
    props: ConfigProps = {
        displayChannelTitle: defaultConfig.displayChannelTitle,
        maxItemPerFeed: defaultConfig.maxItemPerFeed,
    }

    storage = new JSONStorage<ConfigProps>(defaultConfig.storageKeys.global_config);

    update(conf: ConfigProps): Config {
        this.props = {
            displayChannelTitle: conf.displayChannelTitle !== undefined ? conf.displayChannelTitle : this.props.displayChannelTitle,
            maxItemPerFeed: +(conf.maxItemPerFeed !== undefined ? conf.maxItemPerFeed : this.props.maxItemPerFeed),
        }
        return this;
    }

    async save() {
        await this.storage.update(this.props);
    }

    async load() {
        try {
            let res = await this.storage.retrieve();
            if (!res) {
                return;
            }
            this.update(res);
        } catch (e) {
            // @todo: warning/error msg in app
            console.error(e);
        }
    }

    getProps(): ConfigProps {
        return this.props;
    }

    set(newConf: Partial<ConfigProps>) {
        try {
            const baseProps = { ...this.props };
            Object.keys(newConf).forEach((k: string) => {
                if (baseProps[k] === undefined || typeof baseProps[k] !== typeof newConf[k]) {
                    return
                }
                baseProps[k] = newConf[k];
            })
            this.props = { ...baseProps };
        } catch (e) {
            // @todo: warning/error msg in app
            console.error(e);
        }
    }

    get<T,>(key: string): T {
        if (this[key] === undefined) {
            return null;
        }
        return this[key];
    }
}

export default new Config();