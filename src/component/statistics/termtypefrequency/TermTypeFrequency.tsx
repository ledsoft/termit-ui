import * as React from "react";
import SparqlWidget from "../SparqlWidget";
import queryTemplate from "./TermTypeFrequency.rq";
import Chart from 'react-apexcharts'
import {QueryResultIF} from "../../../model/QueryResult";
import LD from "ld-query";
import VocabularyUtils from "../../../util/VocabularyUtils";

interface Props {
    title: string,
    notFilled: string,
    lang: string
}

const defaultChartOptions = {
    chart: {
        id: 'types',
        stacked: true,
    },
    plotOptions: {
        bar: {
            horizontal: true,
        },
    },
};

export default class extends React.Component<Props> {

    private cx = LD({"p": VocabularyUtils.PREFIX, "rdfs": "http://www.w3.org/2000/01/rdf-schema#"});

    private getLabel(res: any, iri: string) {
        if ((VocabularyUtils.PREFIX + "not-filled") === iri) {
            return this.props.notFilled;
        }
        return this.cx(res).query("[@id=" + iri + "] rdfs:label @value");
    }

    public render() {
        const TermTypeFrequencyI = this;
        const query = queryTemplate.split('?lang').join('"' + TermTypeFrequencyI.props.lang + '"');
        const componentFunction = (queryResult: QueryResultIF) => {
            if (!queryResult || !queryResult.result) {
                return <div/>
            }

            const res = queryResult.result;
            const types: object = {};
            TermTypeFrequencyI.cx(res).queryAll("@type").forEach((t: any) => {
                if (!types[t[0]]) {
                    types[t[0]] = TermTypeFrequencyI.getLabel(res, t[0]);
                }
            })

            const vocabularies = {};
            res.filter((r: any) => {
                return r[VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU] !== undefined;
            }).forEach((r: any) => {
                const voc = r[VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU][0];
                const vocabulary = voc["@id"];
                let vocO = vocabularies[vocabulary];
                if (!vocO) {
                    vocO = {name: TermTypeFrequencyI.getLabel(res, vocabulary)};
                    Object.keys(types).forEach(type => {
                        vocO[types[type]] = 0
                    })
                    vocabularies[vocabulary] = vocO;
                }

                const curType = r["@type"];
                vocO[types[curType]] = vocO[types[curType]] + 1 || 1;
            })

            const series = Object.keys(types).map(t => {
                return {
                    name: types[t],
                    data: Object.keys(vocabularies).map(v => vocabularies[v][types[t]])
                }
            });

            const options = Object.assign(defaultChartOptions, {
                xaxis: {
                    categories: Object.keys(vocabularies).map(v => vocabularies[v].name)
                },
            });

            return <Chart options={options}
                          series={series}
                          type="bar"
                          width="100%"
                          height="auto"/>
        }

        return (<div>
            <SparqlWidget
                title={this.props.title}
                componentFunction={componentFunction}
                sparqlQuery={query}/>
        </div>);
    }
}