import 'package:flutter/material.dart';
class Component extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: Color(
            0xffffb290,
          ),
          borderRadius: BorderRadius.circular(
            24,
          ),
          boxShadow: [
            BoxShadow(
              color: Color(
                0xffffff,
              ),
              offset: Offset(
                4,
                4,
              ),
              blurRadius: 24,
              spreadRadius: -12,
            ),
            BoxShadow(
              color: Color(
                0x3fffd689,
              ),
              blurRadius: 4,
            ),
          ],
        ),
      ),
    );
  }
}