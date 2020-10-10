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
            Container(
              child: Stack(
                children: [
                  Container(
                    width: 23,
                    height: 20,
                    decoration: BoxDecoration(
                      color: Color(
                        0xffffc600,
                      ),
                      borderRadius: BorderRadius.circular(
                        4,
                      ),
                    ),
                  ),
                  Positioned.fill(
                    child: Align(
                      alignment: Alignment.topCenter,
                    ),
                  ),
                ],
              ),
              width: 23,
              height: 20,
            ),
            SizedBox(
              height: 1.6666666666666667,
            ),
            Text(
              "low preview quality warning",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w400,
                fontFamily: "Roboto",
              ),
            ),
            SizedBox(
              height: 1.6666666666666667,
            ),
            SizedBox(
              child: Text(
                "there are some unresolved linting warnings on design section, so the built code and preview functionality might not be production ready.",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  fontFamily: "Roboto",
                ),
              ),
              width: 366,
            ),
            SizedBox(
              height: 1.6666666666666667,
            ),
            Container(
              child: Stack(
                children: [
                  Container(
                    child: Container(
                      width: 180,
                      height: 44,
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: Color(
                            0xff373737,
                          ),
                          width: 1,
                        ),
                        borderRadius: BorderRadius.circular(
                          4,
                        ),
                      ),
                    ),
                  ),
                  Positioned.fill(
                    child: Align(
                      alignment: Alignment.center,
                    ),
                  ),
                ],
              ),
              width: 180,
              height: 44,
            ),
          ],
        ),
        width: 366,
      ),
    );
  }
}