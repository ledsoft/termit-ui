import * as React from "react";
import SparqlWidget, {PublicProps} from "../SparqlWidget";
import Chart from "react-apexcharts"
import VocabularyUtils from "../../../util/VocabularyUtils";
import {default as Routes} from "../../../util/Routes";
import RoutingI from "../../../util/Routing";
import withInjectableLoading from "../../hoc/withInjectableLoading";

interface Props extends PublicProps {
    lang: string
}

class TermFrequency extends React.Component<Props> {

    public render() {
        const queryResult = this.props.queryResults;
        if (!queryResult || !queryResult.result) {
            return <div>{this.props.renderMask()}</div>;
        }

        const vocabularies = {};
        queryResult.result.forEach((r: any) => {
            const label = r[VocabularyUtils.RDFS_LABEL][0]["@value"];
            const value = r[VocabularyUtils.HAS_COUNT][0]["@value"];
            vocabularies[r["@id"]] = {value, label};
        });

        const vocList = Object.keys(vocabularies);
        const series = vocList.map(t => (vocabularies[t].value * 1));
        const options = {
            legend: {
                show: false
            },
            labels: vocList.map(t => vocabularies[t].label),
            chart: {
                events: {
                    dataPointSelection(event: any, chartContext: any, config: any) {
                        const iri = VocabularyUtils.create(vocList[config.dataPointIndex]);
                        RoutingI.transitionTo(Routes.vocabularyDetail, {
                            params: new Map([["name", iri.fragment || ""]]),
                            query: new Map([["namespace", iri.namespace || ""]])
                        });
                    }
                }
            }
        };

        return <>
            {this.props.renderMask()}
            <Chart options={options}
                   series={series}
                   type="donut"
                   width="100%"
                   height="auto"/>
        </>;
    }
}

export default withInjectableLoading(SparqlWidget(TermFrequency));
