import * as React from "react";
import SparqlWidget from "../SparqlWidget";
import queryTemplate from "./TermFrequency.rq";
import Chart from "react-apexcharts"
import {QueryResultIF} from "../../../model/QueryResult";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {default as Routes} from "../../../util/Routes";
import RoutingI from "../../../util/Routing";

interface Props {
    title: string,
    lang: string
}

export default class TermFrequency extends React.Component<Props> {

    public render() {
        const query = queryTemplate;
        const componentFunction = (queryResult: QueryResultIF) => {
            if (!queryResult || !queryResult.result) {
                return <div/>
            }

            const vocabularies = {};
            queryResult.result.forEach((r: any) => {
                const label = r[VocabularyUtils.RDFS_LABEL][0]["@value"];
                const value = r[VocabularyUtils.HAS_COUNT][0]["@value"];
                vocabularies[r["@id"]] = {value, label};
            });

            const vocList = Object.keys(vocabularies);
            const series = vocList.map(t => (vocabularies[t].value * 1) );
            const options = {
                legend: {
                    show: false
                },
                labels: vocList.map(t => vocabularies[t].label),
                chart: {
                    events: {
                        dataPointSelection(event: any, chartContext: any, config :any) {
                            const iri = VocabularyUtils.create(vocList[config.dataPointIndex]);
                            RoutingI.transitionTo(Routes.vocabularyDetail, {
                                params: new Map([["name", iri.fragment || ""]]),
                                query: new Map([["namespace", iri.namespace || ""]])
                            })
                        }
                    }
                }
            };

            return <Chart options={options}
                          series={series}
                          type="donut"
                          width="100%"
                          height="auto"/>
        };

        return <SparqlWidget
            title={this.props.title}
            componentFunction={componentFunction}
            sparqlQuery={query}/>;
    }
}