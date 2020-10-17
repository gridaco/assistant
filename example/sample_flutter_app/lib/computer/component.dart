import 'package:flutter/material.dart';
class Component extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              child: Text(
                "Summer / Winter Program",
                style: Theme.of(context).textTheme.headline6,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "We accept application twice a year, summer and winter.\nSummer program closes at every last day of June of the year.\nWinter program colses at every last day of december of the year.",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "Requirements",
                style: Theme.of(context).textTheme.headline6,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "More than 5 years of experience in UI/UX Design",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "Your portfolio made specifically for bridged.",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "Minimun development abillity. (understanding of frontend development)",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "How it works?",
                style: Theme.of(context).textTheme.headline6,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "You get 2 Years of collaborator access by default. we will evaluate you every year rather to be continued.",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "Free access for Bridged Rounge accrossing the world.",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
            SizedBox(
              height: 62.22,
            ),
            SizedBox(
              child: Text(
                "Free access for Bridged’s all product, unlimited, for your team. maximun of 40 seats.",
                style: Theme.of(context).textTheme.subtitle1,
              ),
              width: 825,
            ),
          ],
        ),
        width: 1680,
        padding: EdgeInsets.only(
          left: 328,
          right: 527,
        ),
        decoration: BoxDecoration(
          color: Color(
            0xffffff,
          ),
        ),
      ),
    );
  }
}