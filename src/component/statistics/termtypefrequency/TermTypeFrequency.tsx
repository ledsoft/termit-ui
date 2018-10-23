import * as React from "react";
import SparqlWidget from "../SparqlWidget";
import queryTemplate from "./TermTypeFrequency.rq";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {QueryResultIF} from "../../../model/QueryResult";
import LD from "ld-query";

interface Props {
    title: string
}

class TermTypeFrequency extends React.Component<Props> {

    private addHexColor(c1: string, c2: string): string {
        let hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 6) {
            hexStr = '0' + hexStr;
        } // Zero pad.
        return hexStr;
    }

    public render() {
        const query = queryTemplate;
        const context = LD({"p": 'http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/'});

        // const NOT_FILLED_KEY = "statistics.types.frequency.notfilled";

        const componentFunction = (queryResult: QueryResultIF) => // <div>{JSON.stringify(queryResult)}</div>
        {
            if (!queryResult) {
                return <div/>
            }

            const res = queryResult.result;

            const vocs: string[] = [];
            context(res).queryAll("@type").forEach((t: any) => {
                if (vocs.indexOf(t[0]) < 0) {
                    vocs.push(t[0])
                }
            })

            const types: object = {};
            context(res).queryAll("@type").forEach((t: any) => {
                if (!types[(t[0])]) {

                    // context(res).queryAll("[@id=http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/not-filled] http://www.w3.org/2000/01/rdf-schema#label @value");

                    types[t[0]] = context(res).query("[@id="+t[0]+"] http://www.w3.org/2000/01/rdf-schema#label @value");
                }
            })

            const vocabularies = {};
            res.filter((r: any) => r["http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku"] !== undefined)
                .forEach((r: any) => {
                    const voc = r["http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku"][0];
                    const vocabulary = voc["@id"];
                    if (!(vocabularies[vocabulary])) {
                        vocabularies[vocabulary] = {
                            name: voc["http://www.w3.org/2000/01/rdf-schema#label"]
                        };
                    }
                    Object.keys(types).forEach(type => {
                        if (!vocabularies[vocabulary][types[type]]) {
                            vocabularies[vocabulary][types[type]] = 0
                        }
                    })

                    const curType = r["@type"];
                    if (curType) {
                        vocabularies[vocabulary][types[curType]] = vocabularies[vocabulary][types[curType]] + 1 || 1;
                    }
                    // curType.forEach( (type : string) => { vocabularies[type] = vocabularies[type]+1});
                })

            let i = 0;
            const colors = {}
            colors["not filled"] = "#000000";
            Object.keys(types).forEach(t => {
                colors[t] = "#" + this.addHexColor(i + "" + i + "" + i + "" + i + "" + i + "" + i, '13579A');
                i = i + 4
            })

            return <ResponsiveContainer
                minWidth={300}
                minHeight={400}>
                <BarChart
                    data={Object.keys(vocabularies).map(k => vocabularies[k])}
                    margin={{top: 5, right: 5, left: 5, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    {Object.keys(types).map(type =>
                        <Bar key={type}
                             dataKey={types[type]}
                             stackId="a"
                             fill={colors[type]}/>)}
                </BarChart>
            </ResponsiveContainer>
        }

        return (<div>
            <SparqlWidget
                title={this.props.title}
                componentFunction={componentFunction}
                sparqlQuery={query}/>
        </div>);
    }
}

export default TermTypeFrequency;