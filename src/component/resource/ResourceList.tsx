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
    public tooltip: string;

    constructor(resource: Resource, i18n: (str?: string) => string) {
        super(resource);
        if (resource instanceof Document) {
            this.children = Utils.sanitizeArray(resource.files).map(f => f.iri);
        } else {
            this.children = [];
        }
        this.tooltip = this.label + " - " + i18n(Utils.getAssetTypeLabelId(this));
    }
}

class ResourceList extends React.Component<ResourceListProps> {

    private readonly treeComponent: React.RefObject<IntelligentTreeSelect>;

    public constructor(props: ResourceListProps) {
        super(props);
        this.treeComponent = React.createRef();
    }

    public componentDidMount() {
        this.props.loadResources();
    }

    public componentDidUpdate(prevProps: Readonly<ResourceListProps>): void {
        if (Object.keys(prevProps.resources).length > 0 && this.props.resources !== prevProps.resources) {
            this.treeComponent.current.resetOptions();
        }
    }

    private static valueRenderer(option: Resource) {
        return <div><ResourceBadge resource={option} className="resource-list-badge"/><span>{option.label}</span></div>
    }

    private onChange = (res: Resource | null) => {
        if (res === null) {
            Routing.transitionTo(Routes.resources);
        } else {
            Routing.transitionToAsset(res);
        }
    };

    private flattenAndSetParents(resources: Resource[]): ResourceListItem[] {
        let result: ResourceListItem[] = [];
        for (let i = 0, len = resources.length; i < len; i++) {
            const item: ResourceListItem = new ResourceListItem(resources[i], this.props.i18n);
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
        return <div id="resources-list">
            <IntelligentTreeSelect className="p-0"
                                   ref={this.treeComponent}
                                   onChange={this.onChange}
                                   value={this.props.selectedResource ? this.props.selectedResource.iri : null}
                                   options={options}
                                   valueKey="iri"
                                   labelKey="label"
                                   childrenKey="children"
                                   isMenuOpen={true}
                                   multi={false}
                                   showSettings={false}
                                   displayInfoOnHover={true}
                                   scrollMenuIntoView={false}
                                   renderAsTree={true}
                                   maxHeight={height}
                                   valueRenderer={ResourceList.valueRenderer}
                                   tooltipKey={"tooltip"}
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
