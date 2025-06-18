import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

/**
 * Utility class for creating common CloudWatch Dashboard widgets.
 * This factory simplifies and standardizes the creation of widgets
 * for CloudWatch Dashboards, ensuring consistency.
 */
export class DashboardWidgetFactory {
  /**
   * Creates a CloudWatch GraphWidget.
   * @param title The title of the graph widget.
   * @param metrics An array of IMetric objects to display on the graph.
   * @param options Optional properties for the GraphWidget.
   * @returns A new GraphWidget instance.
   */
  public static createGraphWidget(
    title: string,
    metrics: cloudwatch.IMetric[],
    options?: cloudwatch.GraphWidgetProps,
  ): cloudwatch.GraphWidget {
    return new cloudwatch.GraphWidget({
      title,
      left: metrics, // Assuming metrics are for the left Y-axis by default
      ...options,
    });
  }

  /**
   * Creates a CloudWatch AlarmStatusWidget.
   * @param title The title of the alarm status widget.
   * @param alarms An array of IAlarm objects whose status will be displayed.
   * @param options Optional properties for the AlarmStatusWidget.
   * @returns A new AlarmStatusWidget instance.
   */
  public static createAlarmStatusWidget(
    title: string,
    alarms: cloudwatch.IAlarm[],
    options?: cloudwatch.AlarmStatusWidgetProps,
  ): cloudwatch.AlarmStatusWidget {
    return new cloudwatch.AlarmStatusWidget({
      title,
      alarms,
      ...options,
    });
  }

  /**
   * Creates a CloudWatch SingleValueWidget.
   * @param title The title of the single value widget.
   * @param metrics An array of IMetric objects, typically one, to display as a single value.
   * @param options Optional properties for the SingleValueWidget.
   * @returns A new SingleValueWidget instance.
   */
  public static createSingleValueWidget(
    title: string,
    metrics: cloudwatch.IMetric[],
    options?: cloudwatch.SingleValueWidgetProps,
  ): cloudwatch.SingleValueWidget {
    return new cloudwatch.SingleValueWidget({
      title,
      metrics,
      ...options,
    });
  }

  /**
   * Creates a CloudWatch TextWidget.
   * @param markdown The markdown content to display in the text widget.
   * @param options Optional properties for the TextWidget.
   * @returns A new TextWidget instance.
   */
  public static createTextWidget(
    markdown: string,
    options?: cloudwatch.TextWidgetProps,
  ): cloudwatch.TextWidget {
    return new cloudwatch.TextWidget({
      markdown,
      ...options,
    });
  }
}