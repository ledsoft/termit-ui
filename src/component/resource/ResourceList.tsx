import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import Resource from "../../model/Resource";
import {loadResources} from "../../action/AsyncActions";
import ResourceBadge from "../badge/ResourceBadge";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import VocabularyUtils from "../../util/VocabularyUtils";
import Document from "../../model/Document";
import Utils from "../../util/Utils";

interface ResourceListProps extends HasI18n {
    loadResources: () => void;
    resources: { [id: string]: Resource };
    selectedResource: Resource;
}

class ResourceListItem extends Resource {
    public parent?: string;
    public children: string[];

    constructor(resource: Resource) {
        super(resource);
        if (resource instanceof Document) {
            this.children = Utils.sanitizeArray(resource.files).map(f => f.iri);
        } else {
            this.children = [];
        }
    }
}

class ResourceList extends React.Component<ResourceListProps> {

    public componentDidMount() {
        this.props.loadResources();
    }

    private static _valueRenderer(option: Resource) {
        return <span><ResourceBadge resource={option}/>{option.label}</span>
    }

    private onChange = (res: Resource | null) => {
        if (res === null) {
            Routing.transitionTo(Routes.resources);
            return;
        }
        const iri = VocabularyUtils.create(res.iri);
        Routing.transitionTo(Routes.resourceSummary, {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    };

    private flattenAndSetParents(resources: Resource[]): ResourceListItem[] {
        let result: ResourceListItem[] = [];
        for (let i = 0, len = resources.length; i < len; i++) {
            const item: ResourceListItem = new ResourceListItem(resources[i]);
            result.push(item);
            if (resources[i] instanceof Document && (resources[i] as Document).files) {
                const filesCopy = this.flattenAndSetParents((resources[i] as Document).files);
                filesCopy.forEach(fc => fc.parent = item.iri);
                result = result.concat(filesCopy);
            }
        }
        return result;
    }

    public render() {
        const resources = Object.keys(this.props.resources).map((v) => this.props.resources[v]);
        if (resources.length === 0) {
            return <div className="italics">{this.props.i18n("resource.management.empty")}</div>;
        }
        const options = this.flattenAndSetParents(resources);
        const height = Utils.calculateAssetListHeight();
        return <div>
            <IntelligentTreeSelect className="p-0"
                                   onChange={this.onChange}
                                   value={this.props.selectedResource ? this.props.selectedResource.iri : null}
                                   options={options}
                                   valueKey="iri"
                                   labelKey="label"
                                   childrenKey="children"
                                   isMenuOpen={true}
                                   multi={false}
                                   showSettings={false}
                                   displayInfoOnHover={false}
                                   renderAsTree={true}
                                   maxHeight={height}
                                   valueRenderer={ResourceList._valueRenderer}
            />
        </div>;
    }
}

export default connect((state: TermItState) => {
        return {
            resources: state.resources,
            selectedResource: state.resource,
            intl: state.intl    // Forces component update on language switch
        };
    },
    (dispatch: ThunkDispatch) => {
        return {
            loadResources: () => dispatch(loadResources())
        };
    }
)(injectIntl(withI18n(ResourceList)));