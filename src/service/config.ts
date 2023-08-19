import appConfig, { ChannelTitleMode } from "../../appConfig";
import { JSONStorage } from "./data_storage";
import { log } from "./logchest";

export interface ConfigProps {
    readonly displayChannelTitle: ChannelTitleMode;
    readonly maxItemPerFeed: number;
    readonly displayCategories: boolean;
    readonly maxAmntCategories: number;
}

export class Config {
    props: ConfigProps = {
        displayChannelTitle: appConfig.displayChannelTitle,
        maxItemPerFeed: appConfig.maxItemPerFeed,
        displayCategories: appConfig.displayCategories,
        maxAmntCategories: appConfig.maxAmntCategories,
    }

    storage = new JSONStorage<ConfigProps>(appConfig.storageKeys.global_config);

    update(conf: ConfigProps): Config {
        this.props = {
            displayChannelTitle: conf.displayChannelTitle !== undefined ? conf.displayChannelTitle : this.props.displayChannelTitle,
            maxItemPerFeed: +(conf.maxItemPerFeed !== undefined ? conf.maxItemPerFeed : this.props.maxItemPerFeed),
            displayCategories: conf.displayCategories || this.props.displayCategories,
            maxAmntCategories: conf.maxAmntCategories || this.props.maxAmntCategories,
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
            log("config.load(): " + e);
            console.error("config.load():", e);
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
            log("config.set() " + e);
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